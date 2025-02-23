# AAutoStructX

Welcome to the repository for the **AutoStructX**, a real-time complete solution designed to manage and monitor automated construction operations, such as gluing and prestressing tendon placement. This project is part of the **L&T Hackathon**, aimed at advancing the future of construction with automation, AI, and real-time monitoring. 🏗️🚀

The dashboard provides a 3D virtual representation of the construction site, facilitates interaction with robotic systems, and offers AI-driven suggestions and safety measures to enhance operational efficiency and precision.

---

## **Key Features** 🌟

### 1. **Homepage/Overview** 📊
- A **clean, user-friendly dashboard layout** displaying real-time data from ongoing operations.
- **Project summary** showing the current stage of construction, gluing operation status, and tendon placement.
- A **navigation bar** for quick access to different sections: Gluing, Tendon Placement, AI Models, Emergency Stop, Logs, and more.

### 2. **Gluing Operation** 🛠️
- **3D Virtualization** of the construction site and robotic arm using **Three.js** or similar frameworks.
- Real-time tracking of the **robotic arm’s actions**, such as adhesive application and gluing adjustments.
- **Dynamic logs** tracking each robotic action with timestamps.
- **Emergency stop** option to halt operations based on predefined safety rules or manual intervention.
- Display of **site-specific conditions** (e.g., temperature, humidity) influencing the gluing process.

### 3. **Prestressing Tendon Placement** 🔧
- **3D animations** to visualize reinforcement learning models in action during tendon placement.
- Visual feedback on **placement accuracy** and AI-corrected actions based on real-time data.
- **Stress calculation** to assess how much load the tendons can handle, with optimization recommendations for placement.
- **AI-driven optimization** of tendon placement to improve construction quality based on historical data.

### 4. **Smart Sensor & AI Integration** 🧠
- Integration of **real-time sensor data** (e.g., force, temperature, displacement) into the dashboard.
- **AI algorithms** adapt to sensor data, optimizing the construction process and enhancing precision in real-time.
- **AI-driven alerts** when deviations from ideal conditions occur (e.g., adhesive under-application, tendon misplacement).

### 5. **Workflow Optimization** ⏳
- Visual representation of the **entire construction workflow**, with timeline estimations for each operation phase.
- **Progress tracking** for gluing and tendon placement, identifying delays or bottlenecks.
- A **progress bar** showing completion levels and remaining tasks in the construction phase.

### 6. **Safety and Compliance Monitoring** ⚠️
- **Compliance checks** to ensure all operations align with industry standards and safety guidelines.
- **Safety dashboard** to highlight potential risks and provide AI-generated safety recommendations.
- **User alerts** triggered by emergency stop conditions, either manually or via AI-driven risk assessments.

### 7. **Logs and Analytics** 📈
- A **detailed log section** to review robotic actions, AI operations, and any issues, with timestamps.
- **Real-time analytics** to measure efficiency, accuracy, and resource usage.
- **Performance reports** with visual graphs and charts summarizing key metrics, such as adhesive consumption and AI model accuracy.

### 8. **User Interface Design** 🎨
- A **clean, intuitive UI** to ensure seamless use by operators and site managers.
- **Mobile-responsive layout** for accessibility across different devices.
- **Dark mode** option for better visibility during long operational hours.

---

## **Technologies & Frameworks** 💻

### **Frontend Development** 🌟
- **Next.js** for building a dynamic, responsive UI.
- **Three.js** for rendering 3D visualization of the construction site and robotic actions.
- **D3.js** for creating data-driven visualizations, such as graphs and charts.

### **Backend Development** 🔧
- **Node.js** for server-side processing of real-time data and AI model integration.
- **WebSockets** for establishing real-time communication (e.g., robotic feedback, sensor updates).

### **AI and Machine Learning** 🤖
- **Reinforcement Learning** algorithms used to optimize tendon placement and gluing operations in real-time.
- Integration of **trained AI models** to guide and improve operations, ensuring higher precision and safety.

### **Database** 🗄️
- **MongoDB** for storing operation logs, AI models, and sensor data in a NoSQL format.

### **Security and User Access** 🔐
- Role-based access control for different types of users (e.g., admin, site manager, engineer).
- **Authentication and authorization** using **OAuth** or **JWT** to secure user access.

---

## **Installation & Setup** ⚙️

### 1. Clone the repository:
```bash
git clone https://github.com/aakifnehal/automated-precast-dashboard.git
cd automated-precast-dashboard
```

### 2. Install dependencies:

#### Frontend:
```bash
cd frontend
npm install
```

#### Backend:
```bash
cd backend
npm install
```

### 3. Start the Development Server:

#### Frontend:
```bash
npm start
```

#### Backend:
```bash
npm run dev
```

### 4. Access the Dashboard:
- Open the app in your browser at `http://localhost:3000` (for frontend).
- Backend runs on `http://localhost:5000` for API communication.

---

## **Future Scope** 🔮

- **Integration with additional construction equipment** to automate the entire infrastructure process.
- **Voice recognition** integration for hands-free interaction with the dashboard.
- **Advanced reporting tools** for detailed project tracking and performance metrics.

---

## **Contributors** 🧑‍🤝‍🧑
- [Owaish Jamal](https://github.com/Owaish) - Project Lead
- [Aakif Nehal](https://github.com/contributor1) - AI & ML Specialist
- [Tohid Khan](https://github.com/contributor2) -  Developer

---

## **License** 📄
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

## **Acknowledgments** 🙏
- Special thanks to **L&T** for providing the opportunity to participate in this hackathon and innovate in the construction field.
- Gratitude to the open-source community for the powerful libraries and frameworks like **React.js**, **Three.js**, and **D3.js**.

---

Feel free to reach out if you have any questions or suggestions. Let's build the future of construction together! 🏗️