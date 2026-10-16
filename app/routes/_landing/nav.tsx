interface menuItem {
  name: string
  url: string
}

const menu: menuItem [] = [
  { name: 'Home', url: '' },
  { name: 'Doctors', url: '' },
  { name: 'About Us', url: '' },
  { name: 'Contact Us', url: '' },
]

export default function Nav() {
  return (
    <div className="">
      {menu.map(item => (
        <div key={item.name}>
          <div>{item.name}</div>
        </div>
      ))}
    </div>
  )
}
