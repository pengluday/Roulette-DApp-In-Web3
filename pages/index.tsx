import React, { useState, useRef, useEffect } from 'react'
import { LuckyWheel } from '@lucky-canvas/react'
import UserStatus from "../components/user-status"
import styles from "../styles/Home.module.css";
import { STATUS_CONTRACT_ADDRESS } from "../constants/addresses";
import { ethers } from 'ethers'

// 合约的ABI
const abi = [
  "function getRandomInRange(uint256 max) public view returns (uint256)"
]
// 合约地址
const contractAddress = STATUS_CONTRACT_ADDRESS;


export default function App() {
  const [blocks] = useState([
    { padding: '10px', background: '#869cfa' }
  ])
  const [prizes] = useState(
    Array.from({ length: 36 }, (_, index) => ({
      background: index % 2 === 0 ? '#e9e8fe' : '#b8c5f2', // 根据奇偶数选择背景颜色
      fonts: [{ text: String(index) }] // 设置对应的数字
    }))
  );
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
  const [canPlay, setCanPlay] = useState(false); // 状态提升
  const myLucky = useRef()
  const [provider, setProvider] = useState(null)
  const [contract, setContract] = useState(null)


  // 初始化 ethers.js 和合约
  useEffect(() => {
    const initContract = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer)
      setProvider(provider)
      setContract(contract)
    }

    initContract()
  }, [])

  // 调用智能合约的 getRandomInRange
  const getRandomNumberFromContract = async (max) => {
    if (contract) {
      try {
        const randomNumber = await contract.getRandomInRange(max)
        return randomNumber.toNumber() // 转换为JavaScript的数值
      } catch (err) {
        console.error("Error getting random number: ", err)
      }
    }
    return 0 // 如果调用失败，默认返回0
  }

  return  <main className={styles.main}>
    <div className="{styles.statusContainer}" style={{ marginBottom: "20px" , display: 'flex', justifyContent: "center"}}>
      <h1 style={{ marginBottom: "20px" }}>Lucky Wheel</h1>
    </div>
    <div className="{styles.statusContainer}" style={{ marginBottom: "20px" , display: 'flex', justifyContent: "center"}}>
      <UserStatus setCanPlay={setCanPlay}/>
    </div>
    <div className="{styles.statusContainer}" style={{ marginBottom: "20px" , display: 'flex', justifyContent: "center"}}> 
    <LuckyWheel
      ref={myLucky}
      width="600px"
      height="600px"
      blocks={blocks}
      prizes={prizes}
      buttons={buttons}
      onStart={async () => { // 点击抽奖按钮会触发start回调
        // 先检查 canPlay 状态
        if (!canPlay) {
          alert('你目前无法启动转盘，请先连接钱包');
          return;
        }
        myLucky.current.play(); // 启动转盘
        try {
            const index = await getRandomNumberFromContract(37); // 使用智能合约生成随机数
            setTimeout(() => {
              myLucky.current.stop(index); // 停止转盘
              console.log("index: ", index);
            }, 2500);
        } catch (error) {
            console.error("Error fetching random number: ", error);
            // 处理错误情况，例如默认停止转盘在某个位置
            myLucky.current.stop(0); // 默认停止在0号奖品
        }
    }}
      onEnd={prize => { // 抽奖结束会触发end回调
        alert('恭喜你抽到 ' + prize.fonts[0].text + ' 号奖品')
      }}
    />
  </div>
  
  </main>
}
