const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });
const fs = require('fs');

const doc = {
  openapi: "3.0.0",
  info: {
    title: "Asset Link API",
    version: "1.0.0",
    description: "API Documentation",
  },
  servers: [
    { url: "https://asset-link-api.vercel.app" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

// تشغيل الأداة وبعدين تنظيف الملف برمجياً
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  // 1. قراءة الملف اللي تم توليده
  const swaggerData = JSON.parse(fs.readFileSync(outputFile, 'utf8'));

  // 2. اللف على كل الـ Paths ومسح براميتر الـ Authorization
  for (const path in swaggerData.paths) {
    for (const method in swaggerData.paths[path]) {
      let endpoint = swaggerData.paths[path][method];
      if (endpoint.parameters) {
        endpoint.parameters = endpoint.parameters.filter(
          (p) => p.name.toLowerCase() !== 'authorization'
        );
      }
    }
  }

  // 3. حفظ الملف بعد التنظيف
  fs.writeFileSync(outputFile, JSON.stringify(swaggerData, null, 2));
  console.log('Swagger documentation generated and cleaned automatically!');
});