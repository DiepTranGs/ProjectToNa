import './App.css'
import { TonConnectButton } from '@tonconnect/ui-react'
import { useCounterContract } from './hooks/useCounterContract';
import { useTonConnect } from './hooks/useTonConnect'
import '@twa-dev/sdk';

function App() {
  // const [count, setCount] = useState(0)
  const { value, address, sendIncrement } = useCounterContract();
  const { connected } = useTonConnect();

  return (
    <div className='App'>
      <div className='Container'>
        <TonConnectButton />

        <div className='Card'>
          <b>Wallet Address</b>
          <div className='Hint'>{address?.slice(0, 30) + '...'}</div>
        </div>

        <div className='Card'>
          <b>Number of like for Dee dep trai</b>
          <div>{value ?? 'Loading...'}</div>
        </div>

        <a
          className={`Button ${connected ? 'Active' : 'Disabled'}`}
          onClick={() => {
            sendIncrement()
          }}
        >
          Like here
        </a>
      </div>
    </div>
  )
}

export default App
