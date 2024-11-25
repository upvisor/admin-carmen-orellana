import { IAutomatization, IClient } from '@/interfaces'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

interface Props {
    popup: any
    setPopup: any
    automatization: IAutomatization
}

export const PopupStadistics: React.FC<Props> = ({ popup, setPopup, automatization }) => {

  const [clients, setClients] = useState<IClient[]>()

  const getClients = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/clients`)
    setClients(res.data)
  }

  useEffect(() => {
    getClients()
  }, [])

  return (
    <div onClick={() => {
        if (!popup.mouse) {
          setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
          setTimeout(() => {
            setPopup({ ...popup, view: 'hidden', opacity: 'opacity-0' })
          }, 200)
        }
      }} className={`${popup.view} ${popup.opacity} transition-opacity duration-200 fixed w-full h-full bg-black/20 flex top-0 left-0 z-50 p-4`}>
        <div onMouseEnter={() => setPopup({ ...popup, mouse: true })} onMouseLeave={() => setPopup({ ...popup, mouse: false })} onMouseMove={() => setPopup({ ...popup, mouse: true })} className={`${popup.opacity === 'opacity-1' ? 'scale-1' : 'scale-90'} transition-transform duration-200 w-full max-w-[700px] max-h-[600px] overflow-y-auto p-6 rounded-xl flex flex-col gap-4 m-auto border bg-white shadow-popup dark:shadow-popup-dark dark:bg-neutral-800 dark:border-neutral-700`}>
          <p className="text-lg font-medium">Estadisticas</p>
          <div className='flex flex-col gap-4'>
            {
              automatization.automatization.map((auto, index) => (
                <div key={auto.affair} className='flex flex-col gap-2'>
                  <p className='font-medium'>Correo {index + 1}</p>
                  <div className='flex gap-4 justify-around'>
                    <div className='flex flex-col gap-2'>
                      <p className='m-auto text-center'>Correo enviado</p>
                      <p className='m-auto text-center'>{clients?.filter(client => client.emails?.find(email => email.automatizationId === automatization._id && email.subject === auto.affair)).length}</p>
                    </div>
                    <div className='flex flex-col gap-2'>
                      <p className='m-auto text-center'>Correo abierto</p>
                      <p className='m-auto text-center'>{clients?.filter(client => client.emails?.find(email => email.automatizationId === automatization._id && email.subject === auto.affair && email.opened)).length}</p>
                    </div>
                    <div className='flex flex-col gap-2'>
                      <p className='m-auto text-center'>Click en el enlace</p>
                      <p className='m-auto text-center'>{clients?.filter(client => client.emails?.find(email => email.automatizationId === automatization._id && email.subject === auto.affair && email.clicked)).length}</p>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
          
        </div>
      </div>
  )
}
