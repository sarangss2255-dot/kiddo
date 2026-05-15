import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeOut, LinearTransition, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { Bot, CheckCircle2, Clock, Gamepad2, LogOut, RotateCcw, Star, Trophy, Download } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../AuthContext';
import { auth } from '../firebase';
import { api } from '../api';
import { ChessRewardResponse, Task } from '../types';
import { applyMove, ChessBoard, ChessPosition, countPlayerMoves, createInitialBoard, getLegalMoves, hasKing, pickBotMove } from '../lib/chess';

const pieceSymbols = {
  white: {
    king: '\u2654',
    queen: '\u2655',
    rook: '\u2656',
    bishop: '\u2657',
    knight: '\u2658',
    pawn: '\u2659',
  },
  black: {
    king: '\u265A',
    queen: '\u265B',
    rook: '\u265C',
    bishop: '\u265D',
    knight: '\u265E',
    pawn: '\u265F',
  },
} as const;

function TaskCard({ task, onComplete }: { task: Task; onComplete: (id: string) => void }) {
  const animatedStyle = useAnimatedStyle(() => {
    const isCompleted = task.status === 'completed';
    return {
      transform: [{ scale: withSpring(isCompleted ? 0.97 : 1, { damping: 15 }) }],
      opacity: withTiming(isCompleted ? 0.62 : 1, { duration: 300 }),
      backgroundColor: withTiming(isCompleted ? '#f8fafc' : '#ffffff', { duration: 300 }),
    };
  });

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(15)}
      exiting={FadeOut.duration(250)}
      layout={LinearTransition.springify().damping(15)}
      style={[styles.taskCard, task.status === 'completed' && styles.taskCompleted, animatedStyle]}
    >
      <View style={styles.taskInfo}>
        <View style={styles.taskTextBlock}>
          <View style={styles.titleRow}>
            {task.category ? (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{task.category}</Text>
              </View>
            ) : null}
            <Text style={styles.taskTitle}>{task.title}</Text>
          </View>
          <Text style={styles.taskDesc}>{task.description}</Text>
          {task.dueDate ? (
            <View style={styles.dueDateBadge}>
              <Clock color="#94a3b8" size={12} />
              <Text style={styles.dueDateText}>Due: {new Date(task.dueDate).toLocaleDateString()}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.pointsInfo}>
          <Text style={styles.pointsValue}>+{task.points}</Text>
          <Text style={styles.pointsLabel}>PTS</Text>
        </View>
      </View>

      <View style={styles.footer}>
        {task.status === 'pending' ? (
          <TouchableOpacity onPress={() => onComplete(task.id)} style={styles.completeBtn}>
            <CheckCircle2 color="#fff" size={20} />
            <Text style={styles.completeBtnText}>I'm Done!</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.waitingBadge}>
            <Clock color="#059669" size={16} />
            <Text style={styles.waitingText}>Waiting for Parent</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

export default function KidDashboard() {
  const { profile, refreshProfile } = useAuth();
  const navigation = useNavigation<any>();
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'missions' | 'games'>('missions');
  const [board, setBoard] = React.useState<ChessBoard>(() => createInitialBoard());
  const [selectedSquare, setSelectedSquare] = React.useState<ChessPosition | null>(null);
  const [statusMessage, setStatusMessage] = React.useState('Beat the bot in chess to win bonus points.');
  const [gameOutcome, setGameOutcome] = React.useState<'win' | 'loss' | null>(null);
  const [moveCount, setMoveCount] = React.useState(0);
  const [isBotThinking, setIsBotThinking] = React.useState(false);
  const [rewardMessage, setRewardMessage] = React.useState<string | null>(null);
  const [isClaimingReward, setIsClaimingReward] = React.useState(false);
  const botTurnRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchTasks = async () => {
    try {
      const data = await api.get('/tasks');
      const mappedTasks = data.map((task: any) => ({ ...task, id: task._id }));
      setTasks(
        mappedTasks.filter(
          (task: Task) => task.assignedTo === profile?.uid && ['pending', 'completed'].includes(task.status),
        ),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!profile?.uid) return;

    fetchTasks();
    const interval = setInterval(fetchTasks, 10000);

    return () => clearInterval(interval);
  }, [profile?.uid]);

  React.useEffect(() => {
    return () => {
      if (botTurnRef.current) {
        clearTimeout(botTurnRef.current);
      }
    };
  }, []);

  const claimChessReward = async (completedMoves: number) => {
    try {
      setIsClaimingReward(true);
      const reward = await api.post('/games/chess/reward', {
        outcome: 'win',
        moves: completedMoves,
      }) as ChessRewardResponse;

      await refreshProfile();

      if (reward.awarded) {
        setRewardMessage(`Checkmate reward unlocked: +${reward.pointsAwarded} points.`);
        return;
      }

      const cooldownText = reward.cooldownEndsAt
        ? new Date(reward.cooldownEndsAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
        : 'later';
      setRewardMessage(`Win recorded. Your next chess reward unlocks at ${cooldownText}.`);
    } catch (error) {
      console.error(error);
      setRewardMessage('You won the game, but the reward could not be synced right now.');
    } finally {
      setIsClaimingReward(false);
    }
  };

  const resetChessGame = () => {
    if (botTurnRef.current) {
      clearTimeout(botTurnRef.current);
      botTurnRef.current = null;
    }

    setBoard(createInitialBoard());
    setSelectedSquare(null);
    setStatusMessage('Fresh board. You play white and move first.');
    setGameOutcome(null);
    setMoveCount(0);
    setRewardMessage(null);
    setIsBotThinking(false);
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await api.patch(`/tasks/${taskId}`, {
        status: 'completed',
        completedAt: Date.now(),
      });
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const finishGame = (outcome: 'win' | 'loss', message: string, completedMoves: number) => {
    setGameOutcome(outcome);
    setStatusMessage(message);
    setSelectedSquare(null);
    setIsBotThinking(false);

    if (outcome === 'win') {
      void claimChessReward(completedMoves);
    }
  };

  const handleSquarePress = (row: number, col: number) => {
    if (gameOutcome || isBotThinking) return;

    const tappedPiece = board[row][col];

    if (!selectedSquare) {
      if (tappedPiece?.color === 'white') {
        setSelectedSquare({ row, col });
        setStatusMessage(`${tappedPiece.type.toUpperCase()} selected. Pick a highlighted square.`);
      }
      return;
    }

    if (selectedSquare.row === row && selectedSquare.col === col) {
      setSelectedSquare(null);
      setStatusMessage('Piece unselected.');
      return;
    }

    const legalMoves = getLegalMoves(board, selectedSquare);
    const chosenMove = legalMoves.find((move) => move.row === row && move.col === col);

    if (!chosenMove) {
      if (tappedPiece?.color === 'white') {
        setSelectedSquare({ row, col });
        setStatusMessage(`${tappedPiece.type.toUpperCase()} selected. Pick a highlighted square.`);
      }
      return;
    }

    const playerResult = applyMove(board, { from: selectedSquare, to: chosenMove });
    const updatedMoveCount = moveCount + 1;

    setBoard(playerResult.board);
    setMoveCount(updatedMoveCount);
    setSelectedSquare(null);

    if (!hasKing(playerResult.board, 'black')) {
      finishGame('win', 'Checkmate. You captured the bot king.', updatedMoveCount);
      return;
    }

    const botMove = pickBotMove(playerResult.board);
    if (!botMove) {
      finishGame('win', 'The bot ran out of legal moves. You win.', updatedMoveCount);
      return;
    }

    setIsBotThinking(true);
    setStatusMessage('Coach bot is planning a move...');

    botTurnRef.current = setTimeout(() => {
      const botResult = applyMove(playerResult.board, botMove);
      setBoard(botResult.board);
      setIsBotThinking(false);

      if (!hasKing(botResult.board, 'white')) {
        finishGame('loss', 'The bot captured your king. Try another round.', updatedMoveCount);
        return;
      }

      if (countPlayerMoves(botResult.board, 'white') === 0) {
        finishGame('loss', 'No legal moves left. Reset the board and play again.', updatedMoveCount);
        return;
      }

      setStatusMessage('Your turn. Try to trap the bot king.');
    }, 550);
  };

  const legalTargets = selectedSquare ? getLegalMoves(board, selectedSquare) : [];

  const renderMissions = () => (
    <>
      <Text style={styles.sectionTitle}>Your Missions</Text>
      {loading ? <Text style={styles.emptyText}>Loading missions...</Text> : null}
      {!loading && tasks.length === 0 ? (
        <Text style={styles.emptyText}>No active missions right now. Check back soon.</Text>
      ) : null}
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onComplete={handleCompleteTask} />
      ))}
    </>
  );

  const renderGames = () => (
    <>
      <View style={styles.gamesHero}>
        <View style={styles.gamesHeroIcon}>
          <Gamepad2 color="#fff" size={28} />
        </View>
        <View style={styles.gamesHeroText}>
          <Text style={styles.gamesTitle}>Mini Games</Text>
          <Text style={styles.gamesSubTitle}>Play, practice strategy, and turn wins into rewards.</Text>
        </View>
      </View>

      <View style={styles.gameCard}>
        <View style={styles.gameHeader}>
          <View>
            <Text style={styles.gameLabel}>Active Game</Text>
            <Text style={styles.gameName}>Chess Arena</Text>
          </View>
          <View style={styles.gameRewardBadge}>
            <Star color="#f59e0b" fill="#f59e0b" size={16} />
            <Text style={styles.gameRewardText}>Win for 15 pts</Text>
          </View>
        </View>

        <Text style={styles.gameDescription}>
          You play white. Beat the coach bot by capturing the black king. Reward sync is limited with a cooldown so points cannot be spammed.
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <Text style={styles.statValue}>{profile?.chessWins || 0}</Text>
            <Text style={styles.statLabel}>Wins</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={styles.statValue}>{profile?.chessGamesPlayed || 0}</Text>
            <Text style={styles.statLabel}>Games</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={styles.statValue}>{moveCount}</Text>
            <Text style={styles.statLabel}>Moves</Text>
          </View>
        </View>

        <View style={styles.statusPanel}>
          <View style={styles.statusTitleRow}>
            <Bot color="#0f766e" size={16} />
            <Text style={styles.statusTitle}>Match Status</Text>
          </View>
          <Text style={styles.statusText}>{statusMessage}</Text>
          {rewardMessage ? <Text style={styles.rewardText}>{rewardMessage}</Text> : null}
          {isClaimingReward ? <Text style={styles.rewardPending}>Syncing reward points...</Text> : null}
        </View>

        <View style={styles.boardShell}>
          {board.map((rank, row) => (
            <View key={`row-${row}`} style={styles.boardRow}>
              {rank.map((piece, col) => {
                const isSelected = selectedSquare?.row === row && selectedSquare?.col === col;
                const isTarget = legalTargets.some((target) => target.row === row && target.col === col);
                const isLightSquare = (row + col) % 2 === 0;
                const squareStyle = [
                  styles.square,
                  isLightSquare ? styles.squareLight : styles.squareDark,
                  isSelected ? styles.squareSelected : null,
                  isTarget ? styles.squareTarget : null,
                ];

                return (
                  <TouchableOpacity
                    key={`cell-${row}-${col}`}
                    style={squareStyle}
                    onPress={() => handleSquarePress(row, col)}
                    activeOpacity={0.85}
                  >
                    {piece ? (
                      <Text style={[styles.pieceText, piece.color === 'white' ? styles.whitePiece : styles.blackPiece]}>
                        {pieceSymbols[piece.color][piece.type]}
                      </Text>
                    ) : isTarget ? (
                      <View style={styles.moveDot} />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        <TouchableOpacity onPress={resetChessGame} style={styles.resetBtn}>
          <RotateCcw color="#0f172a" size={18} />
          <Text style={styles.resetBtnText}>Reset Board</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.comingSoonRow}>
        <View style={styles.comingSoonCard}>
          <Text style={styles.comingSoonLabel}>Next Up</Text>
          <Text style={styles.comingSoonTitle}>Memory Match</Text>
          <Text style={styles.comingSoonText}>Fast card flips and streak points.</Text>
        </View>
        <View style={styles.comingSoonCard}>
          <Text style={styles.comingSoonLabel}>Next Up</Text>
          <Text style={styles.comingSoonTitle}>Math Sprint</Text>
          <Text style={styles.comingSoonText}>Quick rounds for bonus learning rewards.</Text>
        </View>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Trophy color="#fff" size={32} />
          </View>
          <View>
            <Text style={styles.greeting}>Hi, {profile?.displayName}!</Text>
            <View style={styles.pointsBadge}>
              <Star color="#f59e0b" fill="#f59e0b" size={16} />
              <Text style={styles.pointsText}>{profile?.points || 0} Points</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (isBotThinking) {
              Alert.alert('Chess match in progress', 'Wait for the bot to finish its move before leaving the game.');
              return;
            }
            auth.signOut();
          }}
          style={styles.logoutBtn}
        >
          <LogOut color="#94a3b8" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'missions' ? renderMissions() : renderGames()}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItemButton} onPress={() => setActiveTab('missions')}>
          <View style={activeTab === 'missions' ? styles.navItemActive : styles.navItem}>
            <Trophy color={activeTab === 'missions' ? '#0ea5e9' : '#94a3b8'} size={24} />
            <Text style={activeTab === 'missions' ? styles.navTextActive : styles.navText}>Missions</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemButton} onPress={() => setActiveTab('games')}>
          <View style={activeTab === 'games' ? styles.navItemActive : styles.navItem}>
            <Gamepad2 color={activeTab === 'games' ? '#0ea5e9' : '#94a3b8'} size={24} />
            <Text style={activeTab === 'games' ? styles.navTextActive : styles.navText}>Games</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemButton} onPress={() => navigation.navigate('Downloads')}>
          <View style={styles.navItem}>
            <Download color="#94a3b8" size={24} />
            <Text style={styles.navText}>Downloads</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    backgroundColor: '#fbbf24',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-3deg' }],
  },
  greeting: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0c4a6e',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 4,
    gap: 6,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0369a1',
  },
  logoutBtn: {
    padding: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#075985',
    marginBottom: 20,
  },
  emptyText: {
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 16,
  },
  taskCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
    borderBottomWidth: 6,
    borderBottomColor: '#bae6fd',
  },
  taskCompleted: {
    borderBottomColor: '#dcfce7',
  },
  taskInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  taskTextBlock: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1f2937',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  categoryBadge: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0369a1',
    textTransform: 'uppercase',
  },
  taskDesc: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
    fontWeight: '500',
  },
  dueDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  dueDateText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '700',
  },
  pointsInfo: {
    alignItems: 'center',
    minWidth: 52,
  },
  pointsValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#f97316',
  },
  pointsLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
  },
  footer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  completeBtn: {
    backgroundColor: '#22c55e',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
  },
  completeBtnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
  },
  waitingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  waitingText: {
    color: '#059669',
    fontWeight: '700',
    fontSize: 13,
  },
  gamesHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
  },
  gamesHeroIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#0f766e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gamesHeroText: {
    flex: 1,
  },
  gamesTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
  },
  gamesSubTitle: {
    color: '#475569',
    fontWeight: '600',
    marginTop: 2,
  },
  gameCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: '#dbeafe',
    marginBottom: 18,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  gameLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0f766e',
    textTransform: 'uppercase',
  },
  gameName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
    marginTop: 2,
  },
  gameRewardBadge: {
    backgroundColor: '#fff7ed',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gameRewardText: {
    color: '#9a3412',
    fontWeight: '800',
  },
  gameDescription: {
    color: '#475569',
    lineHeight: 21,
    marginTop: 12,
    marginBottom: 16,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statChip: {
    flex: 1,
    backgroundColor: '#ecfeff',
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#155e75',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0f766e',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  statusPanel: {
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statusTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  statusTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0f766e',
    textTransform: 'uppercase',
  },
  statusText: {
    color: '#0f172a',
    fontWeight: '700',
    lineHeight: 20,
  },
  rewardText: {
    color: '#15803d',
    fontWeight: '800',
    marginTop: 8,
    lineHeight: 19,
  },
  rewardPending: {
    color: '#a16207',
    fontWeight: '700',
    marginTop: 8,
  },
  boardShell: {
    backgroundColor: '#0f172a',
    padding: 8,
    borderRadius: 22,
  },
  boardRow: {
    flexDirection: 'row',
  },
  square: {
    width: '12.5%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  squareLight: {
    backgroundColor: '#fef3c7',
  },
  squareDark: {
    backgroundColor: '#b45309',
  },
  squareSelected: {
    backgroundColor: '#38bdf8',
  },
  squareTarget: {
    borderWidth: 2,
    borderColor: '#22c55e',
  },
  pieceText: {
    fontSize: 24,
    fontWeight: '900',
  },
  whitePiece: {
    color: '#fff',
    textShadowColor: 'rgba(15, 23, 42, 0.55)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  blackPiece: {
    color: '#111827',
  },
  moveDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#22c55e',
  },
  resetBtn: {
    marginTop: 16,
    backgroundColor: '#e2e8f0',
    borderRadius: 16,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  resetBtnText: {
    color: '#0f172a',
    fontWeight: '900',
    fontSize: 15,
  },
  comingSoonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  comingSoonCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  comingSoonLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  comingSoonTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0f172a',
    marginTop: 6,
    marginBottom: 4,
  },
  comingSoonText: {
    color: '#475569',
    lineHeight: 20,
    fontWeight: '500',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingVertical: 14,
    borderRadius: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  navItemButton: {
    flex: 1,
  },
  navItem: {
    alignItems: 'center',
    opacity: 0.55,
  },
  navItemActive: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  navTextActive: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0ea5e9',
    textTransform: 'uppercase',
  },
});
