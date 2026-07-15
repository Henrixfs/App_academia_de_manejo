import { redirect } from 'next/navigation'

import { getInitialSetupStatus } from '@/services/auth.service'
import { InitialSetupForm } from './setup-form'

const SetupPage = async (): Promise<React.ReactNode> => {
  const status = await getInitialSetupStatus()
  if (!status.setup_required) redirect('/login')
  return <InitialSetupForm />
}

export default SetupPage
