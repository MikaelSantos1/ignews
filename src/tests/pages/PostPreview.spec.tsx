import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { useSession } from 'next-auth/react'
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { getPrismicClient } from '../../services/prismic'
import { useRouter } from 'next/router'


jest.mock('../../services/prismic')
jest.mock('next-auth/react')
jest.mock('next/router')

const post = {
    slug: 'my-new-post',
    title: 'My new  Post',
    content: '<p>Post excerpt</p>',
    updatedAt: '06 de junho de 2022',
}
jest.mock('next-auth/react')
describe('Post Preview Page', () => {

    it('render correctly', () => {
        const useSessionMocked= mocked(useSession)

        useSessionMocked.mockReturnValueOnce({ data: null, status: "loading" });

        render(<Post post={post} />)

        expect(screen.getByText('My new Post')).toBeInTheDocument()
        expect(screen.getByText('Post excerpt')).toBeInTheDocument()
        expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
    })


    it('Redirect user to full page when user is  subscribed', async () => {
        const useSessionMocked= mocked(useSession)
        const useRouterMocked = mocked(useRouter)
        const pushMock= jest.fn()

        useSessionMocked.mockReturnValueOnce({
            data: { 
              activeSubscription: 'fake-active-subscription',
              expires: 'fake-expires'
            },
          } as any)
          useRouterMocked.mockReturnValueOnce({
              push:pushMock
          } as any)

          render(<Post post={post} />)
        
          expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post')

       
    })
    it('loads initial data', async () => {
        
        const getPrismicClientMocked = mocked(getPrismicClient)

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
              data: {
                title: [
                  { type: 'heading', text: 'My new post' }
                ],
                content: [
                  { type: 'paragraph', text: 'Post content' }
                ], 
              },
              last_publication_date: '06-06-2022'
            })
          } as any)
      

      

        const response = await getStaticProps(
            { params: { slug: 'my-new-post' }
         } as any)



        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                      slug: 'my-new-post',
                      title: 'My new post',
                      content: '<p>Post content</p>',
                      updatedAt: '06 de junho de 2022'
                    }
                  }
            })
        )
    })

})