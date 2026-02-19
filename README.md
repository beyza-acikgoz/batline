
#  Batline – Battery Production Line Data Collection & Traceability System

Batline, batarya üretim hatlarında **veri toplama, operatör yönlendirme ve izlenebilirlik** süreçlerini dijitalleştirmek amacıyla geliştirilmiş bir web uygulamasıdır.

Sistem, QR kod üzerinden istasyon tespiti yaparak ilgili üretim formunu otomatik olarak açar, operatörün formu doldurmasını sağlar ve girilen verileri kayıt altına alarak uçtan uca izlenebilirlik sunar.

Uygulama **Next.js** ile geliştirilmiştir ve form tanımlarını merkezi olarak yönetilen `mes-admin` projesinden dinamik olarak çekmektedir.

---

## 🎯 Projenin Amacı

- Üretim hattında manuel form takibini ortadan kaldırmak  
- İstasyon bazlı doğru form yönlendirmesi sağlamak  
- Üretim verilerini merkezi ve güvenilir şekilde kaydetmek  
- İzlenebilirlik (traceability) gereksinimlerini karşılamak  
- Operatör hatalarını minimize etmek  
- Kağıtsız üretim ortamı oluşturmak  

---

## 🏭 Sistem Nasıl Çalışır?

1. Operatör üretim hattındaki istasyonda bulunan QR kodu okutur.
2. QR içeriğine göre sistem ilgili **istasyonu** belirler.
3. `mes-admin` sisteminden o istasyona tanımlı form şeması çekilir.
4. İlgili form dinamik olarak oluşturulur ve ekranda açılır.
5. Operatör formu doldurur.
6. Girilen veriler backend'e iletilir ve veri tabanında saklanır.
7. Veriler üretim partisi / seri numarası ile ilişkilendirilerek izlenebilirlik sağlanır.

---

## 🧩 Mimari Akış

```

QR Scanner
↓
Station Detection
↓
Form Definition (mes-admin)
↓
Dynamic Form Rendering (Next.js)
↓
Validation & Submission
↓
Data Storage & Traceability

```

---

## 🚀 Kullanılan Teknolojiler

- **Next.js**
- React
- TypeScript
- REST API entegrasyonu
- Dinamik Form Rendering
- QR Code parsing
- MES entegrasyonu (`mes-admin`)
- Rol bazlı yetkilendirme yapısı

---

## 📦 Temel Özellikler

- ✅ QR bazlı istasyon tanıma
- ✅ Dinamik form oluşturma
- ✅ Merkezi form tanımı yönetimi
- ✅ Operatör dostu arayüz
- ✅ Üretim verisi kaydı
- ✅ İstasyon bazlı validasyon
- ✅ Rol bazlı erişim kontrolü
- ✅ İzlenebilirlik desteği

---

## 🔄 karluna-mes-admin Entegrasyonu

Batline, form tanımlarını merkezi olarak yönetilen `mes-admin` projesinden almaktadır.

Bu sayede:

- Yeni form eklemek için Batline tarafında deploy gerekmez
- Form değişiklikleri merkezi olarak yönetilir
- İstasyon bazlı form ataması yapılabilir
- Esnek ve ölçeklenebilir yapı sağlanır
- Versiyonlanabilir form yönetimi mümkün olur

---

## 🗂 Proje Yapısı

```

/app
/components
/services
/utils
/hooks
/types

````

---

## 🛠 Kurulum

```bash
git clone https://github.com/beyza-acikgoz/batline.git
cd batline
npm install
npm run dev
````

Production build almak için:

```bash
npm run build
npm start
```

---

## 🔐 Yetkilendirme & Güvenlik

* Rol bazlı erişim kontrolü (Operatör / Admin)
* İstasyon bazlı işlem yetkisi
* Form validasyon mekanizmaları
* Veri bütünlüğü kontrolleri

---

## 📊 Örnek Kullanım Senaryosu

> Operatör "Cell Assembly" istasyonunda QR kod okutur.
> Sistem ilgili montaj kontrol formunu açar.
> Operatör seri numarası, voltaj, sıcaklık gibi alanları doldurur.
> Veri kaydedilir ve ilgili üretim partisi ile ilişkilendirilir.
> Üretim süreci boyunca tüm işlemler izlenebilir hale gelir.

---

## 🎯 Sağlanan Kazanımlar

* 📄 Kağıtsız üretim
* ⚡ Hızlı veri girişi
* 🔎 Tam izlenebilirlik
* 📈 Denetim süreçlerinde kolaylık
* 🛡 Hatalı üretim tespiti
* 🏭 Dijital üretim altyapısı

---

## 📌 Gelecek Geliştirmeler

* 📊 Dashboard & analiz ekranları
* 📈 Gerçek zamanlı istasyon izleme
* 🔔 Hata alarm sistemi
* 📱 Gelişmiş mobil optimizasyon
* 🏭 ERP entegrasyonu
* 📦 Üretim performans metrikleri

---

## 👩‍💻 Proje Sahibi

**Beyza Açıkgöz**
📧 [beyza-ecem2001@hotmail.com](mailto:beyza-ecem2001@hotmail.com)
🔗 LinkedIn: [https://www.linkedin.com/in/beyzaacikgoz/](https://www.linkedin.com/in/beyza-a%C3%A7%C4%B1kg%C3%B6z/)

---

## 📄 Lisans

Bu proje şirket içi kullanım amacıyla geliştirilmiştir.

```
