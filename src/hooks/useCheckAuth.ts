
import { useRouter } from "next/router"
import React, { useEffect } from 'react'
import { useMeQuery } from "../generated/graphql";


export default function useCheckAuth() {
    const router = useRouter();

    const {data, loading} = useMeQuery();

    useEffect(() => {
        if(!loading && data?.me &&  (router.route === "/login" || router.route === "/register")){
            router.replace("/")
        }
    })

    return {data, loading}
  
}