import { StyleSheet, Text, TextInput, View, TouchableOpacity, Modal } from "react-native";
import React, { useState } from "react";
import { validateEmail } from "../utils/validation";
import app from "../utils/firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default function RegisterForm({ changeForm }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleRegister = () => {
    let errors = {};

    if (email === "") {
      errors.email = "El correo electrónico es obligatorio";
    } else if (!validateEmail(email)) {
      errors.email = "Ingresa un correo electrónico válido";
    }

    if (password === "") {
      errors.password = "La contraseña es obligatoria";
    } else if (password.length < 8) {
      errors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    if (confirmPassword === "") {
      errors.confirmPassword = "La confirmación de la contraseña es obligatoria";
    } else if (password !== confirmPassword) {
      errors.passwordMatch = "Las contraseñas no coinciden";
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      const auth = getAuth(app);
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          setShowSuccessModal(true);
        })
        .catch((error) => {
          console.error(error.message);
        });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>

      <TextInput
        style={[styles.input, formErrors.email && styles.inputError]}
        placeholder="Correo electrónico"
        placeholderTextColor="#AAA"
        onChangeText={(text) => {
          setEmail(text);
          setFormErrors((prevErrors) => ({ ...prevErrors, email: null }));
        }}
        value={email}
      />
      {formErrors.email && <Text style={styles.errorText}>{formErrors.email}</Text>}

      <TextInput
        style={[styles.input, formErrors.password && styles.inputError]}
        placeholder="Contraseña"
        placeholderTextColor="#AAA"
        secureTextEntry
        onChangeText={(text) => {
          setPassword(text);
          setFormErrors((prevErrors) => ({ ...prevErrors, password: null }));
        }}
        value={password}
      />
      {formErrors.password && <Text style={styles.errorText}>{formErrors.password}</Text>}

      <TextInput
        style={[styles.input, formErrors.confirmPassword && styles.inputError]}
        placeholder="Confirmar Contraseña"
        placeholderTextColor="#AAA"
        secureTextEntry
        onChangeText={(text) => {
          setConfirmPassword(text);
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            confirmPassword: null,
            passwordMatch: null,
          }));
        }}
        value={confirmPassword}
      />
      {formErrors.confirmPassword && <Text style={styles.errorText}>{formErrors.confirmPassword}</Text>}
      {formErrors.passwordMatch && <Text style={styles.errorText}>{formErrors.passwordMatch}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
      
      

      <Modal
        animationType="slide"
        transparent={true}
        visible={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.successText}>¡Registro Exitoso!</Text>
            <Text style={styles.successMessage}>
              Te has registrado correctamente.
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.closeButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1A1A2E", 
  },
  title: {
    fontSize: 24,
    color: "#FFFFFF", 
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "90%",
    height: 50,
    borderColor: "#6A1B9A", 
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#212A3E", 
    color: "#FFF", 
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    alignSelf: "flex-start",
    width: "90%",
  },
  button: {
    backgroundColor: "#6A1B9A", 
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "90%",
    marginBottom: 15,
  },
  buttonText: {
    color: "#FFF", 
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#212A3E", 
    borderRadius: 10,
    alignItems: "center",
  },
  successText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50", 
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    color: "#FFF", 
    textAlign: "center",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#6A1B9A",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
});
