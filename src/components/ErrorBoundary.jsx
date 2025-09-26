import React from "react";
import { View, Text, StyleSheet } from "react-native";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error);
    console.error("Error info:", errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.error}>
            {this.state.error && this.state.error.toString()}
          </Text>
          <Text style={styles.errorInfo}>
            {this.state.errorInfo?.componentStack}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#5E403F",
  },
  title: {
    fontSize: 20,
    color: "#EAE0D5",
    marginBottom: 20,
    fontWeight: "bold",
  },
  error: {
    fontSize: 16,
    color: "#FF6B6B",
    marginBottom: 10,
    textAlign: "center",
  },
  errorInfo: {
    fontSize: 12,
    color: "#A57878",
    textAlign: "center",
  },
});

export default ErrorBoundary;
