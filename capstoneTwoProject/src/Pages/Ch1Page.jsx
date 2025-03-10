import React from 'react'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import SectionCard from '../components/SectionCard'
import Card from '../components/Card'

export default function Ch1Page() {
    return (
        <>
            <NavBar />
            <h1 className="text-3xl pt-16 p-2">Chapter 1: Functions</h1>
            <SectionCard title={"Linear Functions"} descr={"Learn about the carrying the number technique"} link={"#"} />
            <SectionCard title={"Quadratic Functions"} descr={"Learn about the carrying the number technique"} link={"#"} />
            <SectionCard title={"Lorem Functions"} descr={"Learn about the carrying the number technique"} link={"#"} />
            <SectionCard title={"Ipsum Functions"} descr={"Learn about the carrying the number technique"} link={"#"} />
            <SectionCard title={"Solor Functions"} descr={"Learn about the carrying the number technique"} link={"#"} />
            <Footer />
        </>
    )
}
