import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSocket } from "../services/socket";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001/api" }),
  endpoints: (builder) => ({
    getChannels: builder.query({
      query: () => "/channels",
    }),
    getMessages: builder.query({
      query: (channelId) => `/channels/${channelId}/messages`,
      // After the query completes, subscribe to real-time Socket.IO updates
      async onCacheEntryAdded(
        channelId,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const socket = getSocket();

        try {
          // Wait for initial data to load
          await cacheDataLoaded;

          // Join the channel room
          socket.emit("join_channel", channelId);

          // Listen for new messages pushed via Socket.IO
          const handleNewMessage = (newMessage) => {
            if (String(newMessage.channelId) === String(channelId)) {
              updateCachedData((draft) => {
                draft.push(newMessage);
              });
            }
          };

          socket.on("receive_message", handleNewMessage);

          // Clean up listener when the cache entry is removed
          await cacheEntryRemoved;
          socket.off("receive_message", handleNewMessage);
        } catch {
          // Cache entry was removed before it was added; ignore
        }
      },
    }),
  }),
});

export const { useGetChannelsQuery, useGetMessagesQuery } = chatApi;
