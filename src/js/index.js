document.addEventListener("DOMContentLoaded", () => {
    const dropZone = document.getElementById("dropZone");
    const imageUpload = document.getElementById("imageUpload");
    const previewImage = document.getElementById("previewImage");
    const predictButton = document.getElementById("predictButton");
    const predictedAge = document.getElementById("predictedAge");

    function handleFile(file) {
        if (!file) return;

        // Cek apakah file adalah gambar
        if (!file.type.startsWith("image/")) {
            alert("Please upload a valid image file!");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
            previewImage.style.display = "block";
        };
        reader.readAsDataURL(file);
    }

    // Cegah default behavior agar gambar tidak terbuka di tab baru
    ["dragover", "drop"].forEach((eventName) => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    // Klik untuk memilih file
    dropZone.addEventListener("click", () => imageUpload.click());

    // Saat file dipilih melalui input
    imageUpload.addEventListener("change", (event) => handleFile(event.target.files[0]));

    // Saat file di-drag ke atas area
    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("dragover");
    });

    // Saat file keluar dari area drag & drop
    dropZone.addEventListener("dragleave", (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
    });

    // Saat file di-drop
    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove("dragover");

        if (e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            imageUpload.files = e.dataTransfer.files; // Memastikan file juga terpilih di input
            handleFile(file);
        }
    });

    // Prediksi umur
    predictButton.addEventListener("click", async () => {
        if (!imageUpload.files.length) {
            alert("Please upload an image first!");
            return;
        }

        const file = imageUpload.files[0];
        const formData = new FormData();
        formData.append("image", file);

        predictButton.disabled = true;
        predictButton.textContent = "Predicting...";

        try {
            const response = await fetch("https://b50f-35-201-170-89.ngrok-free.app/predict", {
                method: "POST",
                body: formData
            });
            const data = await response.json();
            predictedAge.textContent = `Predicted Age: ${data.age} years`;
        } catch (error) {
            console.error("Error:", error);
            alert("Error predicting age");
        } finally {
            predictButton.disabled = false;
            predictButton.textContent = "Predict";
        }
    });
});
