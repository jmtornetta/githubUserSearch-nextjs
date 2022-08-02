export default function Content (props) {return(
    //Each page will pass html as props into this Content skeleton
    <main className="w-[95%] mx-auto min-w-[320px] md:w-[90%] lg:w-[85%] xl:w-[80%] bg-brown-50 rounded-md p-6 m-8 shadow-md">
        <h1 className="my-2 text-4xl font-bold text-olive-700">{props.title}</h1>
        <div id="content" className="mt-8">{props.children}</div>
    </main>
)}