import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  createToken,
  deleteToken,
  fetchTokens,
} from '@/redux/slices/tokenSlice'
import type { ApiEnvironment } from '@/redux/slices/environmentSlice'
import {
  ALL_TOOLBOX,
  TOOLBOX_LABELS,
  type ToolboxItem,
} from '@/constants/toolbox'

import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Input from '@/components/Input'
import Button from '@/components/buttons/Button'
import { Checkbox } from '@/components/ui/checkbox'

import Copy from '@/assets/icons/copy.svg?react'
import KeyIcon from '@/assets/icons/components/KeyIcon'
import { cn } from '@/lib/utils'

const formSchema = z.object({
  name: z.string().min(1, 'Token name is required'),
})

type FormType = z.infer<typeof formSchema>

const TokenManagement = () => {
  const dispatch = useAppDispatch()
  const { tokens, isLoading } = useAppSelector((state) => state.token)
  const globalMode = useAppSelector((state) => state.environment.mode)
  const liveEnabled = !!useAppSelector((state) => state.auth.user?.liveEnabled)
  const orgToolbox = (useAppSelector((state) => state.auth.user?.toolbox) ||
    []) as ToolboxItem[]
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedScopes, setSelectedScopes] = useState<ToolboxItem[]>([])
  const [tokenEnvironment, setTokenEnvironment] =
    useState<ApiEnvironment>(globalMode)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  })

  useEffect(() => {
    dispatch(fetchTokens())
  }, [dispatch])

  useEffect(() => {
    if (showCreateDialog) {
      setSelectedScopes(orgToolbox.filter((p) => ALL_TOOLBOX.includes(p)))
      const nextEnv =
        globalMode === 'live' && !liveEnabled ? 'sandbox' : globalMode
      setTokenEnvironment(nextEnv)
    }
  }, [showCreateDialog, orgToolbox, globalMode, liveEnabled])

  const toggleScope = (permission: ToolboxItem, available: boolean) => {
    if (!available) return
    setSelectedScopes((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    )
  }

  const canCreate = orgToolbox.length > 0 && selectedScopes.length > 0

  const onSubmit = async (data: FormType) => {
    if (!canCreate) {
      toast.error('Select at least one available scope')
      return
    }
    try {
      await dispatch(
        createToken({
          name: data.name,
          scopes: selectedScopes,
          environment: tokenEnvironment,
        })
      ).unwrap()
      toast.success('Token created')
      setShowCreateDialog(false)
      reset()
      setSelectedScopes([])
      setTokenEnvironment(globalMode)
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to create token')
    }
  }

  const handleDelete = async (tokenId: string) => {
    dispatch(deleteToken(tokenId))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Token copied to clipboard')
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[#0E1B28] dark:text-[#D7E4F1]">
          Token Management
        </h2>
        <Button
          className={cn(
            'bg-[#FAD645] dark:text-black hover:bg-[#FAD645]/90 [&&]:w-fit [&&]:text-sm [&&]:h-[28px] [&&]:px-2 [&&]:py-3',
            orgToolbox.length === 0 &&
              'opacity-40 cursor-not-allowed hover:bg-[#FAD645]'
          )}
          disabled={orgToolbox.length === 0}
          onClick={() => setShowCreateDialog(true)}
        >
          <span className="flex items-center gap-2 text-sm">
            <KeyIcon width={16} height={16} />
            Create Token
          </span>
        </Button>
      </div>

      <p className="text-sm text-[#82898F] dark:text-[#9CA3AF] mb-6">
        Bearer tokens for programmatic API access. Scopes are limited to your
        organisation toolbox. Use as{' '}
        <code className="text-xs">Authorization: Bearer &lt;token&gt;</code>.
      </p>

      {orgToolbox.length === 0 && (
        <div className="mb-6 p-4 rounded-lg border border-[#E0E0E0] dark:border-[#333333] bg-[#F9F9FB] dark:bg-[#161616] text-sm text-[#82898F]">
          Your organisation has no toolbox products yet. Contact an
          administrator to enable Detect API or Credit Report access.
        </div>
      )}

      <Card className="w-full bg-white dark:bg-[#0D0D0D]">
        <CardContent className="px-6 py-8">
          {isLoading ? (
            <div className="text-center py-8 text-[#82898F] dark:text-[#9CA3AF]">
              Loading tokens...
            </div>
          ) : tokens.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#82898F] dark:text-[#9CA3AF] mb-4">
                No tokens found. Create a Bearer token with scopes for the
                products you can access.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tokens.map((token) => (
                <div
                  key={token.id}
                  className="p-4 border border-[#E0E0E0] dark:border-[#333333] rounded-lg bg-[#F9F9FB] dark:bg-[#161616]"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-[#0E1B28] dark:text-[#D7E4F1]">
                          {token.name}
                        </h3>
                        <span
                          className={cn(
                            'text-xs px-2 py-0.5 rounded capitalize',
                            token.environment === 'live'
                              ? 'bg-[#E8F5E9] text-[#2E7D32] dark:bg-[#1a2e1a] dark:text-[#81C784]'
                              : 'bg-[#FFF8E1] text-[#F57F17] dark:bg-[#2e2a1a] dark:text-[#FFD54F]'
                          )}
                        >
                          {token.environment || 'live'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {(token.scopes || []).map((scope) => (
                          <span
                            key={scope}
                            className="text-xs px-2 py-1 rounded bg-[#E9E9E9] dark:bg-[#232323] text-[#0E1B28] dark:text-[#D7E4F1]"
                          >
                            {TOOLBOX_LABELS[scope as ToolboxItem] || scope}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#82898F] dark:text-[#9CA3AF]">
                        <p>
                          Created:{' '}
                          {new Date(token.createdAt).toLocaleDateString()}
                        </p>
                        {token.lastUsedAt && (
                          <p>
                            Last used:{' '}
                            {new Date(token.lastUsedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <code className="px-3 py-1.5 bg-[#0D0D0D] dark:bg-[#1C1C1C] text-[#FAD645] rounded text-sm font-mono">
                          {token.key.substring(0, 20)}...
                        </code>
                        <Button
                          className="bg-[#E9E9E9] dark:bg-[#232323] text-xs py-1 [&&]:w-fit [&&]:text-sm [&&]:px-2 [&&]:h-[30px]"
                          onClick={() => copyToClipboard(token.key)}
                        >
                          <Copy
                            width={16}
                            height={16}
                            className="stroke-[#060402] dark:stroke-[#9CA3AF]"
                          />
                        </Button>
                      </div>
                    </div>
                    <Button
                      className="bg-[#FDEDED] dark:bg-[#2a1a1a] text-[#E31E18] hover:bg-[#FDEDED]/80 text-xs py-1 [&&]:w-fit [&&]:text-sm [&&]:px-2 [&&]:h-[30px]"
                      onClick={() => handleDelete(token.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-white dark:bg-[#0D0D0D]">
          <DialogHeader>
            <DialogTitle className="text-[#0E1B28] dark:text-[#D7E4F1]">
              Create New Token
            </DialogTitle>
            <DialogDescription className="text-[#82898F] dark:text-[#9CA3AF]">
              Choose scopes available in your organisation toolbox. Unavailable
              products are greyed out.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="py-4 space-y-4">
              <Input
                name="name"
                type="text"
                placeholder="Enter token name"
                icon={KeyIcon}
                control={control}
                error={errors.name?.message}
                classname="w-full"
              />
              <div className="space-y-2">
                <label
                  htmlFor="token-environment"
                  className="text-sm font-medium text-[#0E1B28] dark:text-[#D7E4F1]"
                >
                  Environment
                </label>
                <select
                  id="token-environment"
                  value={tokenEnvironment}
                  onChange={(e) =>
                    setTokenEnvironment(e.target.value as ApiEnvironment)
                  }
                  className="w-full h-10 rounded-lg border border-[#E0E0E0] dark:border-[#333333] bg-white dark:bg-[#161616] px-3 text-sm text-[#0E1B28] dark:text-[#D7E4F1]"
                >
                  <option value="sandbox">Sandbox</option>
                  <option value="live" disabled={!liveEnabled}>
                    Live{!liveEnabled ? ' (not approved)' : ''}
                  </option>
                </select>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium text-[#0E1B28] dark:text-[#D7E4F1]">
                  Scopes
                </p>
                {ALL_TOOLBOX.map((permission) => {
                  const available = orgToolbox.includes(permission)
                  const checked = selectedScopes.includes(permission)
                  return (
                    <label
                      key={permission}
                      className={cn(
                        'flex items-center gap-3 rounded-lg border px-3 py-3',
                        available
                          ? 'border-[#E0E0E0] dark:border-[#333333] cursor-pointer'
                          : 'border-[#E8E8E8] dark:border-[#2a2a2a] opacity-45 cursor-not-allowed bg-[#F5F5F5] dark:bg-[#141414]'
                      )}
                    >
                      <Checkbox
                        checked={checked}
                        disabled={!available}
                        onCheckedChange={() => toggleScope(permission, available)}
                      />
                      <div>
                        <p className="text-sm text-[#0E1B28] dark:text-[#D7E4F1]">
                          {TOOLBOX_LABELS[permission]}
                        </p>
                        {!available && (
                          <p className="text-xs text-[#82898F]">
                            Not enabled for your organisation
                          </p>
                        )}
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                className="bg-white dark:bg-[#1C1C1C] border border-[#E0E0E0] dark:border-[#333333] text-[#0E1B28] dark:text-[#D7E4F1]"
                onClick={() => {
                  setShowCreateDialog(false)
                  reset()
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className={cn(
                  'bg-[#FAD645] dark:text-black hover:bg-[#FAD645]/90',
                  !canCreate && 'opacity-40 cursor-not-allowed'
                )}
                disabled={isSubmitting || !canCreate}
              >
                {isSubmitting ? 'Creating...' : 'Create Token'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TokenManagement
