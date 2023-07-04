# Wiggleton

This codebase has two parts. One part is a golang server that manages the Twitch access token and manages the redemption of Twitch channel points. Another part is a react app that allows you to manage Twitch channel points.

The frontend app is designed to allow you to create channel rewards and periodically retrieve channel rewards redemptions. It then triggers an endpoint on the golang server to create a file with the redemption command. These files can then be processed by another program to execute functionality automatically without needing manual interactions.
