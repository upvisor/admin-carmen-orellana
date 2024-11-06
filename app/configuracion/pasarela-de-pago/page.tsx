"use client"
import { Nav } from '@/components/configuration'
import { ButtonSubmit, Input } from '@/components/ui'
import axios from 'axios'
import Head from 'next/head'
import { usePathname, useRouter } from 'next/navigation'
import React, { ChangeEvent, useEffect, useState } from 'react'

export default function Page () {

  const [loading, setLoading] = useState(false)
  const [payment, setPayment] = useState({
    transbank: {
      active: false,
      commerceCode: '',
      apiKey: ''
    },
    mercadoPago: {
      active: false,
      accessToken: '',
      publicKey: ''
    }
  })
  const [error, setError] = useState('')

  const pathname = usePathname()
  const router = useRouter()

  const getPayment = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/payment`)
    if (res.data?.mercadoPago || res.data?.transbank) {
      setPayment(res.data)
    }
  }

  useEffect(() => {
    getPayment()
  }, [])

  const handleSubmit = async () => {
    if (!loading) {
      setLoading(true)
      setError('')
      if ((payment.mercadoPago.accessToken !== '' && payment.mercadoPago.publicKey !== '') || (payment.transbank.apiKey !== '' && payment.transbank.commerceCode !== '')) {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/payment`, payment)
        await axios.get(`${process.env.NEXT_PUBLIC_WEB_URL}/api/revalidate?tag=payment`)
      } else {
        setError('Debes llenar todos los datos de al menos un metodo de pago')
      }
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Pasarela de pago</title>
      </Head>
        <div className='fixed flex bg-white border-t bottom-0 right-0 p-4 dark:bg-neutral-800 dark:border-neutral-700' style={{ width: 'calc(100% - 250px)' }}>
          <div className='flex m-auto w-full max-w-[1280px]'>
            {
              error !== ''
                ? <p className='px-2 py-1 bg-red-500 text-white w-fit h-fit my-auto'>{ error }</p>
                : ''
            }
            <div className='flex gap-6 ml-auto w-fit'>
              <ButtonSubmit action={handleSubmit} color='main' submitLoading={loading} textButton='Guardar datos' config='w-40' />
              <button onClick={() => router.refresh()} className='my-auto text-sm'>Descartar</button>
            </div>
          </div>
        </div>
        <div className='p-6 w-full flex flex-col gap-6 overflow-y-auto bg-bg dark:bg-neutral-900' style={{ height: 'calc(100% - 73px)' }}>
          <div className='flex w-full max-w-[1280px] mx-auto gap-6'>
            <Nav />
            <div className='w-3/4 flex flex-col gap-6'>
              <h2 className='text-lg font-medium mt-3 pb-3 border-b dark:border-neutral-700'>Pasarela de pago</h2>
              <div className='flex flex-col gap-4'>
                <p>Selecciona los metodos de pago para tu tienda</p>
                <div className='flex gap-2'>
                  <input type='checkbox' checked={payment.transbank.active} onChange={(e: ChangeEvent<HTMLInputElement>) => e.target.checked ? setPayment({ ...payment, transbank: { ...payment.transbank, active: true } }) : setPayment({ ...payment, transbank: { ...payment.transbank, active: false } }) } />
                  <p>Transbank - WebPay Plus</p>
                </div>
                {
                  payment.transbank.active
                    ? (
                      <div className='flex flex-col gap-2'>
                        <div className='flex flex-col gap-2'>
                          <p>Codigo del comercio</p>
                          <Input change={(e: ChangeEvent<HTMLInputElement>) => setPayment({ ...payment, transbank: { ...payment.transbank, commerceCode: e.target.value } })} value={payment.transbank.commerceCode} placeholder='Codigo del comercio' />
                        </div>
                        <div className='flex flex-col gap-2'>
                          <p>Api Key</p>
                          <Input change={(e: ChangeEvent<HTMLInputElement>) => setPayment({ ...payment, transbank: { ...payment.transbank, apiKey: e.target.value } })} value={payment.transbank.apiKey} placeholder='Api Key' />
                        </div>
                      </div>
                    )
                    : ''
                }
                <div className='flex gap-2'>
                  <input type='checkbox' checked={payment.mercadoPago.active} onChange={(e: ChangeEvent<HTMLInputElement>) => e.target.checked ? setPayment({ ...payment, mercadoPago: { ...payment.mercadoPago, active: true } }) : setPayment({ ...payment, mercadoPago: { ...payment.mercadoPago, active: false } })} />
                  <p>MercadoPago</p>
                </div>
                {
                  payment.mercadoPago.active
                    ? (
                      <div className='flex flex-col gap-2'>
                        <div className='flex flex-col gap-2'>
                          <p>Token de acceso</p>
                          <Input change={ (e: ChangeEvent<HTMLInputElement>) => setPayment({ ...payment, mercadoPago: { ...payment.mercadoPago, accessToken: e.target.value } }) } value={payment.mercadoPago.accessToken} placeholder='Token de acceso' />
                        </div>
                        <div className='flex flex-col gap-2'>
                          <p>Public key</p>
                          <Input change={ (e: ChangeEvent<HTMLInputElement>) => setPayment({ ...payment, mercadoPago: { ...payment.mercadoPago, publicKey: e.target.value } }) } value={payment.mercadoPago.publicKey} placeholder='Public key' />
                        </div>
                      </div>
                    )
                    : ''
                }
              </div>
            </div>
          </div>
        </div>
    </>
  )
}