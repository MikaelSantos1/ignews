import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { getSession } from 'next-auth/react'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { getPrismicClient } from '../../services/prismic'


jest.mock('../../services/prismic')

const post = {
    slug: 'my-new-post',
    title: 'My new  Post',
    content: '<p>Post excerpt</p>',
    updatedAt: '06 de junho de 2022',
}
jest.mock('next-auth/react')
describe('Home Page', () => {

    it('render correctly', () => {
        render(<Post post={post} />)

        expect(screen.getByText('My new Post')).toBeInTheDocument()
        expect(screen.getByText('Post excerpt')).toBeInTheDocument()
    })


    it('Redirect user if no subscription is found', async () => {
        const getSessionMocked = mocked(getSession)


        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: null
        } as any)

        const response = await getServerSideProps({ params: { slug: 'my-new-post' } } as any)



        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: '/',
                })
            })
        )
    })
    it('loads initial data', async () => {
        const getSessionMocked = mocked(getSession)
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
      

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: 'fake-active-subscription'
        } as any)

        const response = await getServerSideProps(
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