import { fireEvent, render, screen } from '@testing-library/react'
import { SubscribeButton } from '.'
import { signIn, useSession } from 'next-auth/react';
import { mocked } from 'ts-jest/utils'
import { useRouter } from 'next/router';

jest.mock('next-auth/react')
jest.mock('next/router')

describe('SubscribeButton component', () => {
    it('renders ', () => {
        const useSessionMocked= mocked(useSession)
        useSessionMocked.mockReturnValueOnce({ data: null, status: "loading" });

        render(
            <SubscribeButton  />
        )
        expect(screen.getByText('Subscribe now')).toBeInTheDocument()

    })
    it('should redirect users to sign in when not authenticated',()=>{
        const useSessionMocked= mocked(useSession)
        useSessionMocked.mockReturnValueOnce({ data: null, status: "loading" });

        const signInMocked= mocked(signIn)

        render ( <SubscribeButton  />)

        const subscribeButton=screen.getByText('Subscribe now')

        fireEvent.click(subscribeButton)

        expect(signInMocked).toHaveBeenCalled()
    })
    
    it('Redirects to posts when user already has a subscription',()=>{
        const userRouterMocked= mocked(useRouter)
        const useSessionMocked= mocked(useSession)
        const pushMock= jest.fn()

        useSessionMocked.mockReturnValueOnce({
            data: {
              user: { name: "John Doe", email: "john.doe@example.com" },
              expires: "fake-expires",
              activeSubscription: "fake-active-subscription",
            },
          
            status: "authenticated",
            
          });

      

        userRouterMocked.mockReturnValueOnce({
            push:pushMock
        } as any)
        render(<SubscribeButton/>)

        const subscribeButton=screen.getByText('Subscribe now')
        fireEvent.click(subscribeButton)

        expect(pushMock).toHaveBeenCalled()
    })
})