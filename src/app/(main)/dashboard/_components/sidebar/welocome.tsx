"use client"
import { useUserProfile } from '@/hooks/use-user-profile';
import React from 'react'

const Welcome = () => {
    const { profile, isLoading } = useUserProfile();
    return (
        <div className="flex items-center gap-4">

            <div>
                <p className="text-base !font-bold text-foreground">
                    Good Morning, {profile?.fullName} 👋
                </p>
                <p className="text-xs text-muted-foreground">
                    Here's what's happening with your store today
                </p>
            </div>
        </div>
    )
}

export default Welcome