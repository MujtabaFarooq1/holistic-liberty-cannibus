# Use official node image as the base image
FROM node:14.16.0 as build

# Set the working directory
WORKDIR /app

#Copy package.json app location

COPY package*.json /app/


# Install all the dependencies
RUN npm install --unsafe-perm

# Add the source code to app
COPY ./ /app/

# Generate the build of the application
RUN npm run build --verbose

# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:alpine

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/public /usr/share/nginx/html


# Remove Default nginx file

RUN rm /etc/nginx/conf.d/default.conf

# Copy nginx custome file

COPY --from=build /app/nginx.conf /etc/nginx/conf.d

# Expose port 80
EXPOSE 80

#nginx service start

CMD ["nginx", "-g", "daemon off;"]