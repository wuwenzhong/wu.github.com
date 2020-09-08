FROM 172.21.0.13:8200/daizhang2/czwl-centos-front:1.1
VOLUME /tmp
COPY dist/ /czwl/static
COPY nginx.conf /etc/nginx/nginx.conf
CMD ["nginx","-g","daemon off;"]