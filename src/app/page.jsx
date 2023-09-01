import Image from 'next/image'
import styles from './page.module.css'
import Hero from 'public/hero.png'
import Button from '@/components/Button/Button'

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <h1 className={styles.title}>A one-stop platform for Early Childhood educators/ Companies</h1>
        <p className={styles.desc}>Secure your desired job or find your desired candidate</p>
        <Button url="/login" text="Login"/>
      </div>
      <div className={styles.item}></div>
      <Image src={Hero} alt="" className={styles.img}/>
    </div>
  )
}