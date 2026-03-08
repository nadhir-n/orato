import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/user.js';
import Lesson from './src/models/lesson.js';
import Achievement from './src/models/achievement.js';
import Skill from './src/models/skill.js';
import Challenge from './src/models/challenge.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/english_learning_db';

async function seedProgress() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB...');

    // Find first user in the database
    const user = await User.findOne();
    if (!user) {
      console.log('No users found. Please sign up first, then run this script again.');
      process.exit(1);
    }

    const userId = user._id;
    console.log(`Seeding progress data for user: ${user.name || user.email} (${userId})`);

    // --- Seed Lessons ---
    await Lesson.deleteMany({ userId });
    const now = new Date();
    const lessons = [
      { userId, title: 'English Grammar: Present Tense', category: 'Grammar', timeLeft: '0 min left', totalTime: 18, progress: 100, icon: '📚', iconBg: 'bg-green-200', order: 1, lastAccessed: new Date(now - 1 * 24 * 60 * 60 * 1000) },
      { userId, title: 'English Vocabulary: Common Phrases', category: 'Vocabulary', timeLeft: '0 min left', totalTime: 22, progress: 100, icon: '📖', iconBg: 'bg-blue-100', order: 2, lastAccessed: new Date(now - 1 * 24 * 60 * 60 * 1000) },
      { userId, title: 'English Pronunciation Guide', category: 'Pronunciation', timeLeft: '0 min left', totalTime: 15, progress: 100, icon: '🗣️', iconBg: 'bg-purple-100', order: 3, lastAccessed: new Date(now - 2 * 24 * 60 * 60 * 1000) },
      { userId, title: 'Listening Comprehension: Dialogues', category: 'Listening', timeLeft: '0 min left', totalTime: 25, progress: 100, icon: '🎧', iconBg: 'bg-orange-100', order: 4, lastAccessed: new Date(now - 2 * 24 * 60 * 60 * 1000) },
      { userId, title: 'Writing Practice: Paragraphs', category: 'Writing', timeLeft: '0 min left', totalTime: 30, progress: 100, icon: '✍️', iconBg: 'bg-pink-100', order: 5, lastAccessed: new Date(now - 3 * 24 * 60 * 60 * 1000) },
      { userId, title: 'Advanced Vocabulary: Business', category: 'Vocabulary', timeLeft: '10 min left', totalTime: 20, progress: 50, icon: '💼', iconBg: 'bg-yellow-100', order: 6, lastAccessed: new Date(now - 3 * 24 * 60 * 60 * 1000) },
      { userId, title: 'Grammar: Past Perfect Tense', category: 'Grammar', timeLeft: '5 min left', totalTime: 15, progress: 65, icon: '📚', iconBg: 'bg-green-200', order: 7, lastAccessed: new Date(now - 4 * 24 * 60 * 60 * 1000) },
      { userId, title: 'Speaking: Daily Conversations', category: 'Speaking', timeLeft: '15 min left', totalTime: 25, progress: 30, icon: '🗣️', iconBg: 'bg-purple-100', order: 8, lastAccessed: new Date(now - 5 * 24 * 60 * 60 * 1000) },
    ];
    await Lesson.insertMany(lessons);
    console.log(`✅ Seeded ${lessons.length} lessons`);

    // --- Seed Skills ---
    await Skill.deleteMany({ userId });
    const skills = [
      { userId, name: 'Vocabulary', percentage: 78, color: '#3B82F6', details: { totalWords: 500, masteredWords: 390 } },
      { userId, name: 'Grammar', percentage: 62, color: '#8B5CF6', details: { totalRules: 50, masteredRules: 31 } },
      { userId, name: 'Speaking', percentage: 45, color: '#1DB954', details: { totalExercises: 40, completedExercises: 18 } },
      { userId, name: 'Listening', percentage: 70, color: '#F97316', details: { totalAudio: 30, completedAudio: 21 } },
      { userId, name: 'Writing', percentage: 55, color: '#EC4899', details: { totalExercises: 20, completedExercises: 11 } },
    ];
    await Skill.insertMany(skills);
    console.log(`✅ Seeded ${skills.length} skills`);

    // --- Seed Achievements ---
    await Achievement.deleteMany({ userId });
    const achievements = [
      { userId, title: 'Week Warrior', description: '7-day streak', icon: 'flame', iconColor: 'text-orange-500', iconBg: 'bg-orange-100', rarity: 'common', points: 100, earnedAt: new Date(now - 1 * 24 * 60 * 60 * 1000) },
      { userId, title: 'Quick Learner', description: 'Completed 10 lessons', icon: 'zap', iconColor: 'text-yellow-500', iconBg: 'bg-yellow-100', rarity: 'rare', points: 200, earnedAt: new Date(now - 3 * 24 * 60 * 60 * 1000) },
      { userId, title: 'Vocabulary Master', description: 'Learned 100 words', icon: 'book-open', iconColor: 'text-green-500', iconBg: 'bg-green-100', rarity: 'epic', points: 300, earnedAt: new Date(now - 5 * 24 * 60 * 60 * 1000) },
      { userId, title: 'Grammar Guru', description: 'Completed all grammar lessons', icon: 'star', iconColor: 'text-purple-500', iconBg: 'bg-purple-100', rarity: 'rare', points: 250, earnedAt: new Date(now - 7 * 24 * 60 * 60 * 1000) },
    ];
    await Achievement.insertMany(achievements);
    console.log(`✅ Seeded ${achievements.length} achievements`);

    // --- Seed Daily Challenges ---
    await Challenge.deleteMany({ userId });
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const challenges = [
      { userId, title: 'Complete 3 lessons', current: 2, target: 3, points: 50, type: 'lessons', completed: false, expiresAt: tomorrow },
      { userId, title: 'Practice speaking for 10 min', current: 7, target: 10, points: 30, type: 'speaking', completed: false, expiresAt: tomorrow },
      { userId, title: 'Master 20 new words', current: 15, target: 20, points: 40, type: 'vocabulary', completed: false, expiresAt: tomorrow },
    ];
    await Challenge.insertMany(challenges);
    console.log(`✅ Seeded ${challenges.length} daily challenges`);

    // --- Update user stats ---
    await User.updateOne({ _id: userId }, {
      $set: {
        'stats.dayStreak': 7,
        'stats.streakChange': 2,
        'stats.totalPoints': 1250,
        'stats.rankPercentile': 85,
        'stats.badgesEarned': 4,
        'stats.badgesToNextLevel': 5,
        'stats.lessonsDone': 5,
        'stats.lessonsThisWeek': 3,
        'stats.lastStreakUpdate': now,
      }
    });
    console.log('✅ Updated user stats');

    console.log('\n🎉 Progress data seeded successfully!');
    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seedProgress();
