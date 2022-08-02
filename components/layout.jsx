import Head from "next/head"
import Content from "./content"
import Footer from "./footer"
import Header from "./header"

export default function Layout(props){
    return(
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-olive-100 to-brown-500 text-brown-800">
        <Head>
            <title>{props.title}</title>
            {/* <link rel="icon" href="/favicon.ico" /> //Insert icon here */}
        </Head>
        <Header />
        <Content title={props.title}>
            {props.children}
        </Content>
        <div id="footer-spacer" className="grow"></div>
        <Footer/>
    </div>
)}