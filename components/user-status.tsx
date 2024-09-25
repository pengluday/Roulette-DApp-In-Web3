import { ConnectWallet, Web3Button, useAddress, useContract, useContractRead, useDisconnect } from "@thirdweb-dev/react";
import { STATUS_CONTRACT_ADDRESS } from "../constants/addresses";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { truncateAddress } from "../utils/truncateAddress";

export default function UserStatus({ setCanPlay })  {
    // 获取账户地址
    const address = useAddress();
    // 断开连接
    const disconnect = useDisconnect();
    // 新状态
    const [newStatus, setNewStatus] = useState("");
    // 状态模态框是否打开
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    // 字符计数
    const [characterCount, setCharacterCount] = useState(0);
    // 字符计数装饰
    const characterDecoration = characterCount >= 140 ? styles.characterCountOver : styles.characterCountUnder;
    // 获取合约

    const { contract } = useContract(STATUS_CONTRACT_ADDRESS);

    // 监听 address 变化，动态设置 canPlay
    useEffect(() => {
        if (address) {
        setCanPlay(true);  // 如果 address 不为空，允许玩
        } else {
        setCanPlay(false); // 如果 address 为空，不允许玩
        }
    }, [address, setCanPlay]); // 当 address 或 setCanPlay 变化时触发

    if (!address) {
        return (
            <div>
                <ConnectWallet
                    modalSize="compact"
                />
                <p>Please connect your wallet.</p>
            </div>
        );
    }


    return (
        <div className={styles.userContainer} style={{ maxWidth: "500px" }}>
            <div className={styles.statusHeader}>
                {/* 展示当前账户地址 */}
                <Link href={`/account/${address}`} style={{ color: "white" }}>
                    <p className={styles.connectedAddress}>{truncateAddress(address!)}</p>
                </Link>
                {/* 推出登陆按钮 */}
                <button
                    className={styles.logoutButton}
                    onClick={() => disconnect()}
                >Logout</button>
            </div>

        </div>
    )
};
