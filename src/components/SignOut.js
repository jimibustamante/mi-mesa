import firebase from 'firebase/app'
import 'firebase/auth'

import { useUserContext } from '../contexts/UserContext'

const SignOutButton = () => {
  const [userState, dispatch] = useUserContext()
  const { currentUser } = userState
  const signOut = () => {
    firebase.auth().signOut()
    dispatch({ type: 'AUTH_SIGNED_OUT' })
    document.location.replace('/')
  }

  return (
    currentUser ? (
      <span className='span-link' onClick={signOut}>
        Sign Out
      </span>
    ) : ( '' )
  )
}

export default SignOutButton
