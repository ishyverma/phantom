'use client';

import React from 'react'
import { Button } from '../ui/button'
import { Copy } from 'lucide-react'
import { toast } from 'sonner';

type Props = {
    mnemonics: string[]
}

const MnemonicCard = ({ mnemonics }: Props) => {
  return (
    <div onClick={() => {
        navigator.clipboard.writeText(localStorage.getItem("mnemonic") ?? "");
        toast.success("Copied to clipboard")
    }} className='rounded border p-4 mt-4 cursor-pointer group'>
        <div className='grid lg:grid-cols-4 grid-cols-2 gap-4 w-full'>
            {mnemonics.map((mnemonic, index) => (
                <div key={index} className='flex items-center gap-2 w-full'>
                    <Button variant="secondary" className='w-full h-14 text-base font-medium'>
                        {mnemonic}
                    </Button>
                </div>
            ))}
        </div>
        <div className='mt-3 flex items-center gap-2 dark:text-neutral-300 text-neutral-500 font-normal dark:group-hover:text-white group-hover:text-black transition-all'>
            <Copy className='w-4 h-4' /> Click anywhere on this card to copy
        </div>
    </div>
  )
}

export default MnemonicCard