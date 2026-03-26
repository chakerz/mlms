FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist

EXPOSE 5000
EXPOSE 5001

ENV NODE_ENV=production
ENV ASTM_PORT=5000
ENV WS_PORT=5001
ENV ANALYZER_ID=SIM_CHEM_01
ENV ANALYZER_NAME="SimAnalyzer Pro 2000"
ENV ANALYZER_MODEL=SAP-2000
ENV PROCESSING_TIME_MIN=4000
ENV PROCESSING_TIME_MAX=10000
ENV ABNORMAL_RATE=0.15
ENV ERROR_RATE=0.02

CMD ["node", "dist/index.js"]
