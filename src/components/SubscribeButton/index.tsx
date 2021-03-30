import { signin, useSession } from 'next-auth/client'
import { Router, useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify'
import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe-js'

import styles from './styles.module.scss'

interface SubscribeBurronProps {
  priceId: string
}

export function SubscribeButton({ priceId }: SubscribeBurronProps) {
  const [session] = useSession()
  const router = useRouter()

  console.log(session)

  async function handleSubscribe() {
    if (!session) {
      signin('github')
      return
    }

    if (session.activeSubscription) {
      router.push('/posts')
      return
    }

    try {
      const response = await api.post('/subscribe')

      const { sessionId } = response.data

      const stripe = await getStripeJs()

      await stripe.redirectToCheckout({ sessionId })
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <>
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe Now
    </button>
    </>
  )
}