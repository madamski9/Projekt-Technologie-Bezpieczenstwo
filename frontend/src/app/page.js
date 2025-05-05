"use client"
// import "./globals.css"
import fetchApi from "./components/fetchApi"
import { useEffect, useState } from "react"

const Home = () => {
  const [receivedData, setReceivedData] = useState(null)

  useEffect(() => {
    const getData = async () => {
      const data = await fetchApi()
      setReceivedData(data)
    }
    getData()
  }, [])
  return (
    <div>
      <div>
        Welcome to my page
      </div>
      <p>
        {receivedData ? (
          `Data from API: ${JSON.stringify(receivedData)}`
        ) : (
          'Loading data...'
        )}
      </p>
    </div>
  )
}

export default Home

