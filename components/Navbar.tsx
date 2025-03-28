"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { ModeToggle } from './modeToggle';
import { UserDropdown } from './userDropdown';
import { getAuth } from 'firebase/auth';

const Navbar = () => {

  return (
    <div className="py-2 p-3 border-b flex justify-between items-center">
        <div className="flex items-center gap-5"> 
            <Link href="/home" className=""><Button variant="ghost" size="sm">Accueil</Button></Link>
            <Link href="/applications" className=""><Button variant="ghost" size="sm">Candidatures</Button></Link>
        </div>
        <div className="">
            <div className="flex items-center gap-2">
            <ModeToggle />
            <UserDropdown />
            </div>
        </div>
    </div>
  )
}

export default Navbar