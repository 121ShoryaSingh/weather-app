import NavBar from "@/components/NavBar";


export default function RootLayout({children}:Readonly<{
    children: React.ReactNode;
}>) {
    return(
        <html>
            <body>
                <NavBar/>
                {children}
            </body>
        </html>
    )
}