import Link from "next/link";

export default function Footer(){return(
    <footer className="text-brown-300 bg-brown-700">
        {/* <section id="footer-boxes" className="flex items-center flex-auto my-6 text-center">
            <div className="flex-auto mx-6"><h3>First Footer Box</h3></div>
            <div className="flex-auto mx-6"><h3>Second Footer Box</h3></div>
            <div className="flex-auto mx-6"><h3>Third Footer Box</h3></div>
        </section> */}
        <section id="footer-disclaimers" className="flex items-center">
            <div className="mx-auto my-6 text-sm">
                <p id="copyright" className="text-center">© {new Date().getFullYear()} Jon Tornetta</p>
                <p id="privacyPolicy" className="text-center"><Link href="/privacy-policy">Privacy Policy</Link></p>
            </div>
        </section>
    </footer>
)}