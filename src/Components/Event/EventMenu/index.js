import React from 'react'


export default function EventMenu(props) {
    const { menuItems, activeMenu, setActiveMenu } = props

    return (
        <ul className="eventBox__tabs">
            {
                menuItems.map(item => (
                    <li key={item.id} className={`${item.className}`} onClick={(e) =>{e.preventDefault(); setActiveMenu(item)}} ><a className={`${item.className} ${item.id === activeMenu.id ? 'active' : ''} `} href="#">{item.name}</a></li>
                ))
            }
        </ul>
    )
}
