
import {FaWhatsapp} from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'

export default function DummyChatCard() {
  return (
    <div className=' w-full h-full hidden  lg:flex items-center justify-center bg-slate-600   text-white flex-col'>
        <h1 className='text-xl font-semibold tracking-wider'>Web Chat Application</h1>
        <p className='text-xs  my-1'>Explore, chat, connect, and conquer conversations!</p>
        

    </div>
  )
}
