import React from 'react'


export default function EventMenu(props) {
    const { menuItems, activeMenu, setActiveMenu } = props

    return (
        <ul className="eventBox__tabs">
            {
                menuItems.map(item => (
                    <li className={`${item.className}`} onClick={() => setActiveMenu(item)} ><a className={`${item.className} ${item.id === activeMenu.id ? 'active' : ''} `} href="#">{item.name}</a></li>
                ))
            }
        </ul>
    )
}
