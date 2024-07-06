// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { TouchableOpacity, ScrollView, StyleSheet, Text, TextInput, View, ImageBackground } from 'react-native';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtj2f1CEHtgWmw0amoMzGC2lVQDxnrXE0",
  authDomain: "examen-mendozacontrerasfabian.firebaseapp.com",
  projectId: "examen-mendozacontrerasfabian",
  storageBucket: "examen-mendozacontrerasfabian.appspot.com",
  messagingSenderId: "44970900151",
  appId: "1:44970900151:web:a03e2e67bd68bf3344ab32",
  measurementId: "G-JMWVMSPGXZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const AuthScreen = ({ email, setEmail, password, setPassword, isLogin, setIsLogin, handleAuthentication }) => {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>{isLogin ? 'Sign in' : 'Sign up'}</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleAuthentication}>
        <Text style={styles.buttonText}>{isLogin ? 'Sign in' : 'Sign up'}</Text>
      </TouchableOpacity>
      <View style={styles.bottomContainer}>
        <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Need an account?' : 'Already have an account? Sign in'}
        </Text>
      </View>
    </View>
  );
}

const AuthenticateScreen = ({ user, handleAuthentication }) => {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.emailText}>{user.email}</Text>
      <TouchableOpacity style={styles.button} onPress={handleAuthentication}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleAuthentication = async () => {
    try {
      if (user) {
        console.log("User logged out successfully");
        await signOut(auth);
      } else {
        if (isLogin) {
          await signInWithEmailAndPassword(auth, email, password);
          console.log('User signed in successfully');
        } else {
          await createUserWithEmailAndPassword(auth, email, password);
        }
      }
    } catch (error) {
      console.error('Authentication error: ', error.message);
    }
  }

  return (
    <ImageBackground
      source={{ uri: '/assets/firebaseBackground.png' }}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {user ? (
          <AuthenticateScreen user={user} handleAuthentication={handleAuthentication} />
        ) : (
          <AuthScreen
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            isLogin={isLogin}
            setIsLogin={setIsLogin}
            handleAuthentication={handleAuthentication}
          />
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: 'rgb(110, 64, 125)',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
    color: '#fff',
  },
  buttonContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  toggleText: {
    color: '#fff',
    textAlign: 'center',
  },
  bottomContainer: {
    marginTop: 20,
  },
  emailText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  button: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
});