import React, { useState, useRef } from 'react'
import { LuckyWheel } from '@lucky-canvas/react'
import UserStatus from "../components/user-status"
import styles from "../styles/Home.module.css";

export default function App() {
  const [blocks] = useState([
    { padding: '10px', background: '#869cfa' }
  ])
  const [prizes] = useState([
    { background: '#e9e8fe', fonts: [{ text: '0' }] },
    { background: '#b8c5f2', fonts: [{ text: '1' }] },
    { background: '#e9e8fe', fonts: [{ text: '2' }] },
    { background: '#b8c5f2', fonts: [{ text: '3' }] },
    { background: '#e9e8fe', fonts: [{ text: '4' }] },
    { background: '#b8c5f2', fonts: [{ text: '5' }] },
  ])
  const [buttons] = useState([
    { radius: '40%', background: '#617df2' },
    { radius: '35%', background: '#afc8ff' },
    {
      radius: '30%', background: '#4CAF50',
      pointer: true,
      fonts: [{ text: '开始', top: '-10px' }]
    }
    // {
    //   radius: '50%', 
    //   background: '#4CAF50',  // 青蛙绿色
    //   pointer: true,
    //   eyes: true,  // 增加眼睛标记
    //   fonts: [{ text: '开始', top: '45%' }]
    // }
  ])
  const myLucky = useRef()
  return  <main className={styles.main}>
    <div className="{styles.statusContainer}" style={{ marginBottom: "20px" , display: 'flex', justifyContent: "center"}}>
          <UserStatus/>
    </div>
    <div className="{styles.statusContainer}" style={{ marginBottom: "20px" , display: 'flex', justifyContent: "center"}}> 
    <LuckyWheel
      ref={myLucky}
      width="600px"
      height="600px"
      blocks={blocks}
      prizes={prizes}
      buttons={buttons}
      onStart={() => { // 点击抽奖按钮会触发star回调
        myLucky.current.play()
        setTimeout(() => {
          const index = Math.random() * 6 >> 0
          myLucky.current.stop(index)
        }, 2500)
      }}
      onEnd={prize => { // 抽奖结束会触发end回调
        alert('恭喜你抽到 ' + prize.fonts[0].text + ' 号奖品')
      }}
    />
  </div>
  
  </main>
}
