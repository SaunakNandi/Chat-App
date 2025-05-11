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
    tagTypes:["Chat","User","Message"],
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
            query:({name,id})=>{
                console.log("searchUser ",id)
                return ({
                    url:`user/search?name=${name}&id=${id}`,
                    credentials:"include"
                })
            },
            providesTags:["User"]
        }),

        updateMyProfile:builder.mutation({
            query:(formData)=>{
                return ({
                    url:'user/update-profile',
                    method:'PATCH',
                    credentials:'include',
                    body:formData,
                })
            }
        }),

        forgotPassword:builder.mutation({
            query:(formData)=>{
                console.log(formData)
                return({
                    url:'user/forgot-password',
                    method:'PATCH',
                    credentials:'include',
                    body:formData
                })
            }
        }),

        friendsDetails:builder.query({
            query:(id)=>({
                url:`user/getDetails?id=${id}`,
                credentials:"include",
            }),
            providesTags:["User"]
        }),

        // mutation for POST, PUT, DELETE
        sendFriendRequest:builder.mutation({
            query:(data)=>({
                url:"user/send-req",
                method:"Put",
                credentials:"include",
                body:data,
            }),
            invalidatesTags:["User"]  // Marks "User" data as stale, refetches next time
            // In RTK Query, stale data means cached data that is no longer considered up-to-date and needs to be refetched from the server.
        }),

        acceptFriendRequest:builder.mutation({
            query:(data)=>({
                url:"user/accept-req",
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
        }),

        chatDetails:builder.query({

            // u can find populate in getChatDetails(in server) also
            query:({chatId,populate=false})=>{
                let url=`chat/${chatId}`
                if(populate) url+="?populate=true"
                return {
                    url,
                    credentials:"include"
                }
            },
            providesTags:["Chat"]  // for caching
        }),

        // keepUnusedDataFor:0 to solve the issue: If I text you, you will get the message. But if you go to some another chat and then come to my chat my latest text will not be present. If you have reload the page again to view the message. 
        getMessages:builder.query({
            query:({chatId,page})=>({
                url:`chat/message/${chatId}?page=${page}`,
                credentials:"include"
            }),
            keepUnusedDataFor:0
        }),

        sendAttachments:builder.mutation({
            query:(data)=>({
                url:'chat/message',
                method:'POST',
                credentials:"include",
                body:data,
            })
        }),
        myGroups:builder.query({
            query:()=>({
                url:'chat/my/groups',
                credentials:"include"
            }),
            providesTags:["Chat"]  // for caching
        }),
        newGroup:builder.mutation({
            query:({name,members})=>({
                url:"chat/new",
                method:"POST",
                credentials:"include",
                body:{name,members},
            }),
            invalidatesTags:["Chat"] // refetching to load chats for new added friend
        }),
        availableFriends:builder.query({
            query:(chatId)=>{
                console.log(chatId)
                let url=`user/friends`
                if(chatId) url+=`?chatId=${chatId}`;
                return{
                    url,
                    credentials:"include"
                }
            },
            providesTags:["Chat"]  // for caching
        }),
        renameGroup:builder.mutation({
            query:({chatId,name})=>({
                url:`chat/${chatId}`,
                method:"PUT",
                credentials:"include",
                body:{name},
            }),
            invalidatesTags:["Chat"] // refetching to load chats for new added friend
        }),
        removeGroupMember:builder.mutation({
            query:({chatId,userId})=>({
                url:`chat/remove-members`,
                method:"PUT",
                credentials:"include",
                body:{chatId,userId},
            }),
            invalidatesTags:["Chat"] // refetching to load chats for new added friend
        }),
        addGroupMember:builder.mutation({
            query:({members,chatId})=>({
                url:`chat/add-members`,
                method:"PUT",
                credentials:"include",
                body:{members,chatId},
            }),
            invalidatesTags:["Chat"] // refetching to load chats for new added friend
        }),
        deleteChat: builder.mutation({
            query:(chatId)=>({
                url:`chat/${chatId}`,
                method:"DELETE",
                credentials:"include",
            }),
            invalidatesTags:["Chat"]
        }),
        leaveGroup: builder.mutation({
            query:(chatId)=>({
                url:`chat/leave/${chatId}`,
                method:"DELETE",
                credentials:"include",
            }),
            invalidatesTags:["Chat"]
        })
    })
})

// console.log(api.endpoints?.acceptFriendRequest) // to about the hooks created for the corresponding endpoints
    

export default api
export const {useMyChatsQuery,useLazySearchUserQuery,useSendFriendRequestMutation,useGetNotificationsQuery,
    useAcceptFriendRequestMutation,useChatDetailsQuery,useGetMessagesQuery, useSendAttachmentsMutation, useMyGroupsQuery,useAvailableFriendsQuery,useNewGroupMutation,useRenameGroupMutation,useRemoveGroupMemberMutation,useAddGroupMemberMutation,useFriendsDetailsQuery,useDeleteChatMutation,useLeaveGroupMutation,useForgotPasswordMutation}=api