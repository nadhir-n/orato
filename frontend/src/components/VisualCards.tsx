import React, { useState, useEffect } from 'react';

// 1. Define TypeScript Interface based on our MongoDB Schema
interface CardData {
  _id: string;
  word: string;
  definition: string;
  imageUrl: string;
  difficultyLevel: string;
}

const VisualCards: React.FC = () => {
  // State Management
  const [cards, setCards] = useState<CardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null)