// ─── Live Counter Component (Mobile) ───
const LiveCounter = ({ target, label, suffix = '' }: { target: number, label: string, suffix?: string }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const duration = 2000;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        const liveTimer = setInterval(() => {
            setCount(prev => prev + Math.floor(Math.random() * 2) + 1);
        }, 8000);
        return () => { clearInterval(timer); clearInterval(liveTimer); };
    }, [target]);

    return (
        <View style={styles.statItem}>
            <View style={styles.statValueRow}>
                <View style={styles.liveDot} />
                <Text style={styles.statValue}>{count.toLocaleString()}{suffix}</Text>
            </View>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
};

export default function WelcomeScreen() {
    const router = useRouter();
    const [showIntro, setShowIntro] = useState(true);
    const videoRef = useRef<Video>(null);

    // Animations
    const contentOpacity = useRef(new Animated.Value(0)).current;
    const contentTranslateY = useRef(new Animated.Value(40)).current;
    const logoScale = useRef(new Animated.Value(0)).current;
    const featureAnims = useRef([0, 1, 2, 3].map(() => new Animated.Value(0))).current;
    const buttonsAnim = useRef(new Animated.Value(0)).current;

    const features = [
        { emoji: '✨', label: 'Walia AI', desc: 'GPT-4, Gemini & Claude help' },
        { emoji: '💬', label: 'Social', desc: 'Connect with study groups' },
        { emoji: '🛠️', label: 'Tools', desc: 'Summaries & Flashcards' },
        { emoji: '📅', label: 'Calendar', desc: 'Smart study schedules' },
    ];

    const animateWelcomeContent = useCallback(() => {
        Animated.sequence([
            Animated.spring(logoScale, { toValue: 1, tension: 50, friction: 5, useNativeDriver: true }),
            Animated.parallel([
                Animated.timing(contentOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.timing(contentTranslateY, { toValue: 0, duration: 400, useNativeDriver: true }),
            ]),
            Animated.stagger(100, featureAnims.map(anim =>
                Animated.spring(anim, { toValue: 1, tension: 60, friction: 6, useNativeDriver: true })
            )),
            Animated.spring(buttonsAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
        ]).start();
    }, []);

    const onVideoEnd = useCallback((status: AVPlaybackStatus) => {
        if (status.isLoaded && status.didJustFinish) {
            setShowIntro(false);
            animateWelcomeContent();
        }
    }, [animateWelcomeContent]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (showIntro) {
                setShowIntro(false);
                animateWelcomeContent();
            }
        }, 8000);
        return () => clearTimeout(timer);
    }, []);

    if (showIntro) {
        return (
            <View style={styles.introContainer}>
                <StatusBar style="light" />
                <Video
                    ref={videoRef}
                    source={require('../../assets/images/3d-logo.mp4')}
                    style={styles.introVideo}
                    resizeMode={ResizeMode.COVER}
                    shouldPlay
                    isMuted={false}
                    volume={1.0}
                    onPlaybackStatusUpdate={onVideoEnd}
                />
                <SafeAreaView edges={['top']} style={styles.skipContainer}>
                    <TouchableOpacity style={styles.skipBtn} onPress={() => { setShowIntro(false); animateWelcomeContent(); }}>
                        <Text style={styles.skipText}>Skip →</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <View style={StyleSheet.absoluteFill}>
                <View style={styles.bgBase} />
                <View style={styles.bgGlowTop} />
                <View style={styles.bgGlowBottom} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <SafeAreaView style={styles.safeArea}>
                    {/* Top section - Logo */}
                    <View style={styles.topSection}>
                        <View style={styles.badge}>
                            <View style={[styles.liveDot, { backgroundColor: '#4ADE80' }]} />
                            <Text style={styles.badgeText}>v1.0 — OUT NOW</Text>
                        </View>
                        <Animated.View style={[styles.logoOuter, { transform: [{ scale: logoScale }] }]}>
                            <View style={styles.logoInner}>
                                <Image
                                    source={require('../../assets/images/walia-logo.png')}
                                    style={styles.logoImage}
                                    resizeMode="contain"
                                />
                            </View>
                        </Animated.View>
                        <Animated.View style={{ opacity: contentOpacity, transform: [{ translateY: contentTranslateY }] }}>
                            <Text style={styles.appName}>Walia</Text>
                            <Text style={styles.tagline}>Climb Higher. Think Smarter.</Text>
                        </Animated.View>
                    </View>

                    {/* Feature cards */}
                    <View style={styles.featuresGrid}>
                        {features.map((f, i) => (
                            <Animated.View
                                key={i}
                                style={[
                                    styles.featureCard,
                                    {
                                        opacity: featureAnims[i],
                                        transform: [{
                                            translateY: featureAnims[i].interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [30, 0],
                                            })
                                        }],
                                    }
                                ]}
                            >
                                <Text style={styles.featureEmoji}>{f.emoji}</Text>
                                <Text style={styles.featureLabel}>{f.label}</Text>
                                <Text style={styles.featureDesc}>{f.desc}</Text>
                            </Animated.View>
                        ))}
                    </View>

                    {/* Stats Section */}
                    <View style={styles.statsSection}>
                        <LiveCounter target={12450} label="Students" suffix="+" />
                        <LiveCounter target={1200500} label="AI Messages" suffix="+" />
                    </View>

                    {/* Buttons */}
                    <Animated.View style={[styles.buttonsSection, {
                        opacity: buttonsAnim,
                        transform: [{ translateY: buttonsAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
                    }]}>
                        <TouchableOpacity style={styles.getStartedBtn} onPress={() => router.push('/(auth)/signup')}>
                            <Text style={styles.getStartedText}>Get Started Free →</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/(auth)/login')}>
                            <Text style={styles.loginText}>Already a member? </Text>
                            <Text style={styles.loginTextBold}>Sign In</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </SafeAreaView>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    introContainer: { flex: 1, backgroundColor: '#000' },
    introVideo: { width, height, position: 'absolute', top: 0, left: 0 },
    skipContainer: { position: 'absolute', top: 0, right: 0, paddingHorizontal: Spacing.xl, paddingTop: Spacing.md },
    skipBtn: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 20, paddingVertical: 10,
        borderRadius: BorderRadius.pill,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    },
    skipText: { color: '#fff', fontSize: FontSize.sm, fontWeight: FontWeight.semiBold },

    container: { flex: 1 },
    bgBase: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000' },
    bgGlowTop: { position: 'absolute', width: width * 1.5, height: width * 1.5, borderRadius: width, backgroundColor: '#fff', opacity: 0.03, top: -width * 0.8, left: -width * 0.25 },
    bgGlowBottom: { position: 'absolute', width: width * 1.2, height: width * 1.2, borderRadius: width, backgroundColor: '#fff', opacity: 0.02, bottom: -width * 0.6, right: -width * 0.2 },
    
    scrollContent: { flexGrow: 1 },
    safeArea: { flex: 1, paddingHorizontal: Spacing.xxl, paddingBottom: Spacing.xl },
    
    topSection: { alignItems: 'center', paddingTop: Spacing.xl, marginBottom: Spacing.xl },
    badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.pill, borderVertical: 1, borderColor: 'rgba(255,255,255,0.15)', marginBottom: 24 },
    badgeText: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
    
    logoOuter: {
        width: 100, height: 100, borderRadius: 50,
        borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center', justifyContent: 'center',
        padding: 4, marginBottom: Spacing.lg,
    },
    logoInner: {
        width: 88, height: 88, borderRadius: 44,
        backgroundColor: '#000', overflow: 'hidden',
        alignItems: 'center', justifyContent: 'center',
    },
    logoImage: { width: 88, height: 88 },
    appName: { fontSize: 48, fontWeight: '900', color: '#FFFFFF', letterSpacing: -1, marginBottom: 4, textAlign: 'center' },
    tagline: { fontSize: FontSize.md, color: 'rgba(255,255,255,0.5)', fontWeight: '600', textAlign: 'center' },

    featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing.xxl },
    featureCard: {
        width: (width - Spacing.xxl * 2 - Spacing.md) / 2,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: BorderRadius.xl, padding: Spacing.lg,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    },
    featureEmoji: { fontSize: 24, marginBottom: 8 },
    featureLabel: { fontSize: FontSize.md, fontWeight: '800', color: '#fff', marginBottom: 4 },
    featureDesc: { fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 15, fontWeight: '500' },

    statsSection: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: BorderRadius.xl, paddingVertical: 20, marginBottom: Spacing.xxl, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    statItem: { alignItems: 'center' },
    statValueRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4ADE80' },
    statValue: { fontSize: 18, fontWeight: '900', color: '#fff' },
    statLabel: { fontSize: 9, fontWeight: '800', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 },

    buttonsSection: { gap: Spacing.md },
    getStartedBtn: {
        backgroundColor: '#fff',
        borderRadius: BorderRadius.pill, paddingVertical: 18,
        alignItems: 'center', shadowColor: '#fff', shadowOpacity: 0.1, shadowRadius: 10,
    },
    getStartedText: { color: '#000', fontSize: FontSize.lg, fontWeight: '900' },
    loginBtn: { flexDirection: 'row', justifyContent: 'center', paddingVertical: Spacing.sm },
    loginText: { fontSize: FontSize.md, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
    loginTextBold: { fontSize: FontSize.md, color: '#fff', fontWeight: '900' },
});
