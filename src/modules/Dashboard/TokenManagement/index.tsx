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

import Copy from '@/assets/icons/copy.svg?react'
import KeyIcon from '@/assets/icons/components/KeyIcon'

const formSchema = z.object({
  name: z.string().min(1, 'Token name is required'),
})

type FormType = z.infer<typeof formSchema>

const TokenManagement = () => {
  const dispatch = useAppDispatch()
  const { tokens, isLoading } = useAppSelector((state) => state.token)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

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
  }, [])

  const onSubmit = async (data: FormType) => {
    dispatch(createToken(data.name))
    setShowCreateDialog(false)
    reset()
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
          className="bg-[#FAD645] dark:text-black hover:bg-[#FAD645]/90 [&&]:w-fit [&&]:text-sm [&&]:h-[28px] [&&]:px-2 [&&]:py-3"
          onClick={() => setShowCreateDialog(true)}
        >
          <span className="flex items-center gap-2 text-sm">
            <KeyIcon width={16} height={16} />
            Create Token
          </span>
        </Button>
      </div>

      <Card className="w-full bg-white dark:bg-[#0D0D0D]">
        <CardContent className="px-6 py-8">
          {isLoading ? (
            <div className="text-center py-8 text-[#82898F] dark:text-[#9CA3AF]">
              Loading tokens...
            </div>
          ) : tokens.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#82898F] dark:text-[#9CA3AF] mb-4">
                No tokens found. Create your first token to get started.
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
                      <h3 className="font-semibold text-[#0E1B28] dark:text-[#D7E4F1] mb-2">
                        {token.name}
                      </h3>
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
              Give your token a name to easily identify it later.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="py-4">
              <Input
                name="name"
                type="text"
                placeholder="Enter token name"
                icon={KeyIcon}
                control={control}
                error={errors.name?.message}
                classname="w-full"
              />
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
                className="bg-[#FAD645] dark:text-black hover:bg-[#FAD645]/90"
                disabled={isSubmitting}
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
