
import { useRouter } from "next/router"
import React, { useEffect } from 'react'
import { useMeQuery } from "../generated/graphql";

const UN_AUTHEN_ROUTES = ["/login", "/register", "/forgot-password"]

export default function useCheckAuth() {
    const router = useRouter();

    const {data, loading = true} = useMeQuery();

    useEffect(() => {
        if(!loading && data?.me && UN_AUTHEN_ROUTES.includes(router.route)){
            router.replace("/")
        }

        else if(!loading && !data?.me && !UN_AUTHEN_ROUTES.includes(router.route)){
            router.replace("/login")
        }
    }, [data, loading])

    return {data, loading: loading || (!data?.me && !UN_AUTHEN_ROUTES.includes(router.route)) || (data?.me && UN_AUTHEN_ROUTES.includes(router.route))}
}