<template>
    <div class="org-chart">
      <!-- The main employee node -->
      <div class="employee">
        <h3>{{ node.name }}</h3>
        <p>{{ node.leftTotal }}</p>
      </div>
  
      <!-- SVG Arrow Lines -->
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <!-- Define arrowhead marker -->
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="black" />
          </marker>
        </defs>
  
        <!-- Left diagonal arrow (adjusted for left subordinates) -->
        <line v-if="node.left?.length" x1="100" y1="20" x2="20" y2="70" stroke="black" stroke-width="2" marker-end="url(#arrowhead)" />
  
        <!-- Right diagonal arrow (adjusted for right subordinates) -->
        <line v-if="node.right?.length" x1="100" y1="20" x2="180" y2="70" stroke="black" stroke-width="2" marker-end="url(#arrowhead)" />
  
        <!-- Central node (optional for visual context) -->
        <circle cx="100" cy="20" r="5" fill="green" />
      </svg>
  
      <!-- Left subordinates rendered horizontally -->
      <div v-if="node.left && node.left.length" class="subordinates left">
        <OrgChart
          v-for="(child, index) in node.left"
          :key="`left-${index}`"
          :node="child"
        />
      </div>
  
      <!-- Right subordinates rendered horizontally -->
      <div v-if="node.right && node.right.length" class="subordinates right">
        <OrgChart
          v-for="(child, index) in node.right"
          :key="`right-${index}`"
          :node="child"
        />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "OrgChart",
    props: {
      node: {
        type: Object,
        required: true,
      },
    },
    methods: {
      // Helper function to calculate SVG line X2 coordinate for subordinates (if needed)
      childOffset(index, total) {
        const gap = 50; // Space between subordinates
        const base = 50; // Base offset for centering arrows
        const offset = (index - (total - 1) / 2) * gap;
        return `${base + offset}%`;
      },
    },
  };
  </script>
  
  <style scoped>
  .org-chart {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  
  .employee {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: center;
    background-color: #f9f9f9;
    border-radius: 8px;
    width: 150px;
    margin-bottom: 20px;
  }
  
  .subordinates {
    display: flex;
    justify-content: space-around;
    width: 100%;
  }
  
  .subordinates.left {
    justify-content: flex-start; /* Align left subordinates to the left */
  }
  
  .subordinates.right {
    justify-content: flex-end; /* Align right subordinates to the right */
  }
  
  .connector {
    width: 100%;
    height: 20px;
    position: absolute;
    top: 60px; /* Adjust depending on the size of the employee box */
  }
  </style>
  