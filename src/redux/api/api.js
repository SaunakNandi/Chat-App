// using rtk query

import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {server} from '../../constants/config.js'

//caching enabled by default

// note1
const api=createApi({
    reducerPath:'api',
    baseQuery:fetchBaseQuery({
        baseUrl:`${server}/api/v1/`,
    }),
    tagTypes:["Chat","User"],
    endpoints:(builder)=>({
        // query for get requests
        myChats:builder.query({
            query:()=>({
                url:"chat/my",
                credentials:"include",  // why include?
            }),
            // providesTags in query
            providesTags:["Chat"]  // for caching
        }),
        // invalidateTags in mutation
        // invalidateTags:["Chat"] // refetching to load chats for new added friend

        searchUser:builder.query({
            query:(name)=>(
                {
                    url:`user/search?name=${name}`,
                    credentials:"include"
                }
            ),
            providesTags:["User"]
        }),

        sendFriendRequest:builder.mutation({
            query:(data)=>({
                url:"/user/send-req",
                method:"Put",
                credentials:"include",
                body:data,
            }),
            invalidatesTags:["User"]
        }),

        acceptFriendRequest:builder.mutation({
            query:(data)=>({
                url:"/user/accept-req",
                method:"PUT",
                credentials:"include",
                body:data,
            }),
            invalidatesTags:["Chat"] // refetching to load chats for new added friend
        }),

        getNotifications:builder.query({
            query:()=>({
                url:`user/notifications`,
                credentials:"include"
            }),
            keepUnusedDataFor:0  // no caching
        })
    })
})

console.log(api.endpoints?.acceptFriendRequest) // to about the hooks created for the corresponding endpoints
    

export default api
export const {useMyChatsQuery,useLazySearchUserQuery,useSendFriendRequestMutation,useGetNotificationsQuery,
    useAcceptFriendRequestMutation}=api