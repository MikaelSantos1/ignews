import { SignInButton } from '../SignInButton'

import styles from './style.module.scss'

import { ActiveLink } from '../ActiveLink'
export function Header() {
    
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <img src="/images/logo.svg" alt="ig.news" />
                <nav>
                    <ActiveLink href="/" ActiveClassName={styles.active}>
                        <a>Home</a>
                    </ActiveLink>
                    <ActiveLink href="/posts"ActiveClassName={styles.active} prefetch>
                        <a>Posts</a>
                    </ActiveLink>

                </nav>
                <SignInButton />
            </div>
        </header>
    )
}