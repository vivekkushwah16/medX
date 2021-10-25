import React, { useContext, useState,useEffect } from 'react'
import usePWA from 'react-pwa-install-prompt'
import PWAInstallerPrompt from 'react-pwa-installer-prompt';
import { INSTALL_PWA_ANALYTICS_EVENT } from '../../AppConstants/AnalyticsEventName';
import { AnalyticsContext } from '../../Context/Analytics/AnalyticsContextProvider';
import PWAStyle from './index.module.css'

export default function PWApromptWithButton() {
    const { isStandalone, isInstallPromptSupported, promptInstall } = usePWA()
    const onClickInstall = async () => {
        const didInstall = await promptInstall()
        if (didInstall) {
            // User accepted PWA install
        }
    }
    const renderInstallButton = () => {
        if (isInstallPromptSupported && isStandalone)

            return (
                <button onClick={onClickInstall}>Prompt PWA Install</button>
            )
        return null
    }
    return (<div>
        <h2>PWA Infos</h2>
        <p>Is Install Prompt Supported ? {isInstallPromptSupported ? 'true' : 'false'}</p>
        <p>Is Standalone ? {isStandalone ? 'true' : 'false'}</p>
        {renderInstallButton()}
    </div>)
}

export const PWAInstaller = () => {
    const [show, toggleShow] = useState(false)
    const { addGAWithUserInfo, addCAWithUserInfo } = useContext(AnalyticsContext);

    useEffect(() => {

        let isShow = sessionStorage.getItem("show_pwa")
        if (!isShow){
            toggleShow(true)
        }
        return () => {
            // cleanup
        }
    }, [])

    const handleCancleBtn = () =>{
        sessionStorage.setItem("show_pwa", false)
        toggleShow(false)
    }

    return (
        <>
            {
                show &&
                <PWAInstallerPrompt
                    render={({ onClick }) => (
                        <div className={PWAStyle.pwaContainer}>
                            <div className={PWAStyle.pwaModal}>
                                <div className={PWAStyle.titleContainer}>
                                Add a shortcut to your home screen<br/>for quick access to latest content.
                                </div>
                                <div className={PWAStyle.btnContainer}>
                                    <button onClick={handleCancleBtn} className={PWAStyle.cancelBtn}>
                                        Not now
                                    </button>

                                    <button onClick={(e) => {
                                        onClick(e)
                                        addGAWithUserInfo(
                                            INSTALL_PWA_ANALYTICS_EVENT
                                        );
                                        addCAWithUserInfo(
                                            `/${INSTALL_PWA_ANALYTICS_EVENT}`,
                                            true
                                        );
                                    }} className={PWAStyle.installBtn}>
                                        Add Shortcut
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    callback={(data) => console.log(data)}
                />
            }
        </>
    )
}

/*
callback from PWAInstallerPrompt
{
   isInstallAllowed: true, // true, if app in not installed and when user has cancelled the request
   isInstallWatingConfirm: false, // true, if user has clicked on install and not confirmed
   isInstalling: false, // true, if being installed
   isInstallCancelled: false, // true, if user has cancelled
   isInstallSuccess: false, // true, if install success
   isInstallFailed: false // true, if installation is failed
}
*/