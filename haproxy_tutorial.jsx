const { useState } = React;

/* ─────────────────────────────────────────────
   DONNÉES
───────────────────────────────────────────── */
const modules = [
  {
    id: 1,
    label: "Introduction",
    color: "#06b6d4",
    icon: "⚖️",
    steps: [
      {
        title: "Qu'est-ce que HAProxy ?",
        icon: "📖",
        content: (
          <div>
            <p className="intro-text">
              <strong>HAProxy</strong> (High Availability Proxy) est une solution gratuite, très rapide et fiable offrant la <em>haute disponibilité</em>, l'<em>équilibrage de charge</em> et un <em>proxy</em> pour les applications TCP et HTTP.
            </p>
            <p className="intro-text">
              Il convient particulièrement aux sites Web à très fort trafic et alimente bon nombre des sites les plus visités au monde. Il est devenu l'<strong>équilibreur de charge open source standard</strong> et est souvent déployé par défaut sur les plateformes cloud.
            </p>
            <div className="info-grid">
              <div className="info-card">
                <span className="info-icon">🌐</span>
                <div>
                  <div className="info-label">Site Officiel</div>
                  <div className="info-value"><a href="http://www.haproxy.org/" target="_blank" rel="noreferrer">haproxy.org</a></div>
                </div>
              </div>
              <div className="info-card">
                <span className="info-icon">⚡</span>
                <div>
                  <div className="info-label">Type</div>
                  <div className="info-value">Load Balancer + Proxy</div>
                </div>
              </div>
              <div className="info-card">
                <span className="info-icon">📜</span>
                <div>
                  <div className="info-label">Licence</div>
                  <div className="info-value">Open Source / Gratuit</div>
                </div>
              </div>
              <div className="info-card">
                <span className="info-icon">🔀</span>
                <div>
                  <div className="info-label">Protocoles</div>
                  <div className="info-value">TCP & HTTP</div>
                </div>
              </div>
            </div>
            <div className="tip-box tip-blue">
              <span className="tip-icon">💡</span>
              <div><strong>Proxy :</strong> Un proxy est un serveur intermédiaire entre un appareil et Internet. Il permet de filtrer, cacher ton adresse IP, ou contourner certaines restrictions d'accès à des sites web.</div>
            </div>
          </div>
        ),
      },
      {
        title: "Algorithmes de répartition de charge",
        icon: "🔄",
        content: (
          <div>
            <p className="intro-text">HAProxy propose plusieurs algorithmes pour répartir les requêtes entre les serveurs.</p>
            <div className="algo-grid">
              <div className="algo-card">
                <div className="algo-header">
                  <span className="algo-icon">🔁</span>
                  <span className="algo-name">Round Robin</span>
                  <span className="algo-badge used">Utilisé dans ce TP</span>
                </div>
                <p className="algo-desc">Répartition équitable 50%/50% entre les serveurs. Chaque serveur traite le même nombre de requêtes. Nécessite des serveurs homogènes en termes de capacité.</p>
              </div>
              <div className="algo-card">
                <div className="algo-header">
                  <span className="algo-icon">📍</span>
                  <span className="algo-name">Source</span>
                </div>
                <p className="algo-desc">Un client est toujours dirigé vers le même serveur selon son adresse IP. Nécessaire quand les sites utilisent des <strong>sessions PHP</strong>.</p>
              </div>
              <div className="algo-card">
                <div className="algo-header">
                  <span className="algo-icon">📉</span>
                  <span className="algo-name">Least Connection</span>
                </div>
                <p className="algo-desc">Les requêtes sont envoyées vers le serveur le moins chargé. En théorie idéal, mais en pratique un serveur peut être "chargé" en attente d'une base de données.</p>
              </div>
              <div className="algo-card">
                <div className="algo-header">
                  <span className="algo-icon">🏁</span>
                  <span className="algo-name">First Response</span>
                </div>
                <p className="algo-desc">Les requêtes sont envoyées à tous les serveurs simultanément, le premier qui répond prend la connexion. Difficile à mettre en œuvre, rarement employé.</p>
              </div>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: 2,
    label: "Infrastructure",
    color: "#10b981",
    icon: "🗺️",
    steps: [
      {
        title: "Topologie du labo",
        icon: "🗺️",
        content: (
          <div>
            <p className="intro-text">Le labo est composé de <strong>3 machines</strong> sur le même segment LAN <code>172.20.0.0/24</code>.</p>
            <div className="topo-table">
              <div className="topo-row header">
                <span>Machine</span><span>Hostname</span><span>IP LAN</span><span>Rôle</span>
              </div>
              <div className="topo-row">
                <span>⚖️ HAProxy</span><span><code>HA-Proxy</code></span><span><code>172.20.0.10/24</code></span><span>Load Balancer</span>
              </div>
              <div className="topo-row">
                <span>🌐 Web 1</span><span><code>SRV-WEB1</code></span><span><code>172.20.0.11/24</code></span><span>Serveur Apache</span>
              </div>
              <div className="topo-row">
                <span>🌐 Web 2</span><span><code>SRV-WEB2</code></span><span><code>172.20.0.12/24</code></span><span>Serveur Apache</span>
              </div>
            </div>
            <div className="schema-box">
              <div className="schema-client">💻 Client<div className="schema-sub">navigateur</div></div>
              <div className="schema-arrow">→ HTTP →</div>
              <div className="schema-haproxy">⚖️ HAProxy<div className="schema-sub">172.20.0.10:80</div></div>
              <div className="schema-split">
                <div className="schema-arrow-split">→ 50% →</div>
                <div className="schema-arrow-split">→ 50% →</div>
              </div>
              <div className="schema-servers">
                <div className="schema-srv">🌐 SRV-WEB1<div className="schema-sub">172.20.0.11</div></div>
                <div className="schema-srv">🌐 SRV-WEB2<div className="schema-sub">172.20.0.12</div></div>
              </div>
            </div>
            <p className="section-subtitle">Cartes réseau HAProxy</p>
            <div className="topo-table">
              <div className="topo-row header two"><span>Carte</span><span>Mode / IP</span></div>
              <div className="topo-row two"><span>Carte 1 (ens33)</span><span><code>172.20.0.10/24</code> — Segment LAN statique</span></div>
              <div className="topo-row two"><span>Carte 2 (ens36)</span><span>NAT + DHCP (accès Internet)</span></div>
            </div>
          </div>
        ),
      },
      {
        title: "Installation HAProxy",
        icon: "⚙️",
        content: (
          <div>
            <p className="intro-text">Installer HAProxy sur la machine dédiée à la répartition de charge.</p>
            <p className="section-subtitle">Installation</p>
            <div className="cmd-block">
              <div className="cmd-line"><span className="prompt">$</span> sudo apt update && sudo apt upgrade -y</div>
              <div className="cmd-line"><span className="prompt">$</span> sudo apt install haproxy -y</div>
            </div>
            <p className="section-subtitle">Vérification</p>
            <div className="cmd-block">
              <div className="cmd-line"><span className="prompt">$</span> haproxy -v</div>
              <div className="cmd-line"><span className="prompt">$</span> systemctl status haproxy</div>
            </div>
            <div className="tip-box tip-green">
              <span className="tip-icon">✅</span>
              <div>Le fichier de configuration est : <code>/etc/haproxy/haproxy.cfg</code></div>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: 3,
    label: "Serveurs Web",
    color: "#f59e0b",
    icon: "🌐",
    steps: [
      {
        title: "Installation Apache & site web",
        icon: "🖥️",
        content: (
          <div>
            <p className="intro-text">Installer Apache et déployer le site <strong>The Grill</strong> sur <strong>SRV-WEB1</strong> et <strong>SRV-WEB2</strong>.</p>
            <p className="section-subtitle">Installation des paquets</p>
            <div className="cmd-block">
              <div className="cmd-line"><span className="prompt">$</span> sudo apt install apache2 wget unzip -y</div>
            </div>
            <p className="section-subtitle">Téléchargement & décompression du site</p>
            <div className="cmd-block">
              <div className="cmd-line"><span className="prompt">$</span> cd /var/www/html</div>
              <div className="cmd-line"><span className="prompt">$</span> wget https://github.com/technext/thegrill/archive/master.zip</div>
              <div className="cmd-line"><span className="prompt">$</span> unzip master.zip</div>
            </div>
            <p className="section-subtitle">Configuration du DocumentRoot Apache</p>
            <div className="cmd-block">
              <div className="cmd-line"><span className="prompt">$</span> nano /etc/apache2/sites-available/000-default.conf</div>
            </div>
            <div className="file-block">
              <div className="file-header">📄 000-default.conf — modifier DocumentRoot</div>
              <pre>{`<VirtualHost *:80>
    # Modifier cette ligne :
    DocumentRoot /var/www/html/thegrill-master
    ...
</VirtualHost>`}</pre>
            </div>
            <div className="cmd-block">
              <div className="cmd-line"><span className="prompt">$</span> service apache2 restart</div>
              <div className="cmd-line"><span className="prompt">$</span> service apache2 status</div>
            </div>
            <div className="tip-box tip-green">
              <span className="tip-icon">✅</span>
              <div>Le service Apache doit être en état <strong>active (running)</strong>.</div>
            </div>
          </div>
        ),
      },
      {
        title: "Différencier les deux serveurs",
        icon: "🏷️",
        content: (
          <div>
            <p className="intro-text">Pour valider le load balancing, on différencie visuellement les deux serveurs en modifiant le titre de la page.</p>
            <p className="section-subtitle">Sur SRV-WEB1</p>
            <div className="cmd-block">
              <div className="cmd-line"><span className="prompt">$</span> nano /var/www/html/thegrill-master/index.html</div>
            </div>
            <div className="file-block">
              <div className="file-header">📄 index.html — SRV-WEB1</div>
              <pre>{`<!-- Chercher le titre THE GRILL et ajouter "1" -->
<h1>THE GRILL 1</h1>`}</pre>
            </div>
            <p className="section-subtitle">Sur SRV-WEB2</p>
            <div className="cmd-block">
              <div className="cmd-line"><span className="prompt">$</span> nano /var/www/html/thegrill-master/index.html</div>
            </div>
            <div className="file-block">
              <div className="file-header">📄 index.html — SRV-WEB2</div>
              <pre>{`<!-- Chercher le titre THE GRILL et ajouter "2" -->
<h1>THE GRILL 2</h1>`}</pre>
            </div>
            <div className="tip-box">
              <span className="tip-icon">ℹ️</span>
              <div>Cette différenciation permet de voir en temps réel quel serveur répond à chaque requête lors du test du balancement.</div>
            </div>
          </div>
        ),
      },
      {
        title: "Validation 1 — Connectivité",
        icon: "🔍",
        content: (
          <div>
            <p className="intro-text">Vérifier que toutes les machines sont bien configurées et accessibles avant de configurer HAProxy.</p>
            <p className="section-subtitle">Sur toutes les machines — Vérifier les IPs</p>
            <div className="cmd-block">
              <div className="cmd-line"><span className="prompt">$</span> ip a <span className="cmd-comment"># Linux</span></div>
              <div className="cmd-line"><span className="prompt">PS&gt;</span> ipconfig <span className="cmd-comment"># Windows</span></div>
            </div>
            <p className="section-subtitle">Depuis HAProxy — Ping les serveurs web</p>
            <div className="cmd-block">
              <div className="cmd-line"><span className="prompt">$</span> ping 172.20.0.11 <span className="cmd-comment"># → SRV-WEB1 : OK</span></div>
              <div className="cmd-line"><span className="prompt">$</span> ping 172.20.0.12 <span className="cmd-comment"># → SRV-WEB2 : OK</span></div>
            </div>
            <p className="section-subtitle">Sur les serveurs Web — Vérifier Apache</p>
            <div className="cmd-block">
              <div className="cmd-line"><span className="prompt">$</span> service apache2 status <span className="cmd-comment"># → active (running)</span></div>
            </div>
            <div className="topo-table">
              <div className="topo-row header two"><span>Test</span><span>Résultat attendu</span></div>
              <div className="topo-row two"><span>ip a sur HAProxy</span><span><code>172.20.0.10/24</code> visible</span></div>
              <div className="topo-row two"><span>ip a sur SRV-WEB1</span><span><code>172.20.0.11/24</code> visible</span></div>
              <div className="topo-row two"><span>ip a sur SRV-WEB2</span><span><code>172.20.0.12/24</code> visible</span></div>
              <div className="topo-row two"><span>ping 172.20.0.11 depuis HAProxy</span><span>✅ OK</span></div>
              <div className="topo-row two"><span>ping 172.20.0.12 depuis HAProxy</span><span>✅ OK</span></div>
              <div className="topo-row two"><span>Apache sur WEB1 et WEB2</span><span>✅ active (running)</span></div>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: 4,
    label: "Config HAProxy",
    color: "#e55b2d",
    icon: "⚙️",
    steps: [
      {
        title: "Éditer haproxy.cfg",
        icon: "📝",
        content: (
          <div>
            <p className="intro-text">Ajouter la configuration du load balancing à la fin du fichier <code>/etc/haproxy/haproxy.cfg</code>.</p>
            <div className="cmd-block">
              <div className="cmd-line"><span className="prompt">$</span> nano /etc/haproxy/haproxy.cfg</div>
            </div>
            <p className="section-subtitle">Ajouter à la fin du fichier</p>
            <div className="file-block">
              <div className="file-header">📄 /etc/haproxy/haproxy.cfg — ajout en fin de fichier</div>
              <pre>{`# Configuration du balancement
listen clusterWeb
    bind 172.20.0.10:80

    # Mode d'écoute
    mode http

    # Mode de balancement (round robin 50%-50%)
    balance roundrobin

    # Options
    option httpclose
    option forwardfor

    # Liste des serveurs impliqués dans le balancement
    server SRV-WEB1 172.20.0.11:80 check
    server SRV-WEB2 172.20.0.12:80 check

    # Statistiques
    stats enable
    stats hide-version
    stats refresh 30s
    stats show-node
    stats auth admin:password
    stats uri /statistique`}</pre>
            </div>
            <div className="tip-box">
              <span className="tip-icon">⚠️</span>
              <div>Remplacer <code>172.20.0.10</code> par l'adresse IP réelle de votre carte LAN HAProxy (vérifier avec <code>ip a</code>).</div>
            </div>
          </div>
        ),
      },
      {
        title: "Explication de chaque directive",
        icon: "📚",
        content: (
          <div>
            <p className="intro-text">Comprendre le rôle de chaque directive de configuration.</p>
            <div className="directive-list">
              {[
                ["listen clusterWeb", "Déclare un bloc d'écoute nommé clusterWeb. C'est ici que toute la config du load balancer est regroupée."],
                ["bind 172.20.0.10:80", "Spécifie l'adresse IP et le port sur lesquels HAProxy écoute. Les clients accèdent au contenu web via cette IP."],
                ["mode http", "Spécifie que le balancement est pour du contenu HTTP. Utiliser mode tcp pour d'autres protocoles (ex: MySQL)."],
                ["balance roundrobin", "Algorithme de répartition : chaque serveur reçoit les requêtes à tour de rôle (50%/50%)."],
                ["option httpclose", "Ferme la connexion HTTP après chaque requête (mode non-persistant)."],
                ["option forwardfor", "Ajoute l'en-tête X-Forwarded-For pour que les serveurs web voient la vraie IP du client."],
                ["server SRV-WEB1 172.20.0.11:80 check", "Déclare SRV-WEB1 comme serveur cible. Le mot-clé check active la surveillance de disponibilité."],
                ["stats enable", "Active la page de statistiques HAProxy."],
                ["stats hide-version", "Cache la version HAProxy (sécurité)."],
                ["stats refresh 30s", "Rafraîchit automatiquement la page de stats toutes les 30 secondes."],
                ["stats auth admin:password", "Protège la page de stats par login/mot de passe."],
                ["stats uri /statistique", "Définit l'URL d'accès aux statistiques : http://IP/statistique"],
              ].map(([cmd, desc], i) => (
                <div className="directive-item" key={i}>
                  <code className="directive-cmd">{cmd}</code>
                  <p className="directive-desc">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        title: "Validation 2 — Démarrage HAProxy",
        icon: "🚀",
        content: (
          <div>
            <p className="intro-text">Redémarrer HAProxy et vérifier que tout fonctionne.</p>
            <p className="section-subtitle">Redémarrer et vérifier le service</p>
            <div className="cmd-block">
              <div className="cmd-line"><span className="prompt">$</span> systemctl restart haproxy</div>
              <div className="cmd-line"><span className="prompt">$</span> systemctl status haproxy <span className="cmd-comment"># → Active: active (running)</span></div>
            </div>
            <p className="section-subtitle">Tester le load balancing — depuis un client</p>
            <div className="steps-list">
              {[
                ["Ouvrir IE ou Edge sur la machine client", ""],
                ["Aller sur http://172.20.0.10", ""],
                ["Vous devez voir : THE GRILL 1", "SRV-WEB1 répond"],
                ["Actualiser la page (F5)", ""],
                ["Vous devez voir : THE GRILL 2", "SRV-WEB2 répond — balancement OK !"],
              ].map(([txt, note], i) => (
                <div className="step-item" key={i}>
                  <span className="step-num-small">{i + 1}</span>
                  <div><div className="step-item-text">{txt}</div>{note && <div className="step-item-note">{note}</div>}</div>
                </div>
              ))}
            </div>
            <p className="section-subtitle">Accéder aux statistiques</p>
            <div className="tip-box tip-blue">
              <span className="tip-icon">📊</span>
              <div>
                URL : <code>http://172.20.0.10/statistique</code><br />
                Login : <strong>admin</strong> / Mot de passe : <strong>password</strong><br />
                Les deux serveurs doivent apparaître en <span style={{color:"#34d399",fontWeight:"bold"}}>vert (UP)</span>.
              </div>
            </div>
            <p className="section-subtitle">Tester la haute disponibilité</p>
            <div className="cmd-block">
              <div className="cmd-line"><span className="prompt">$</span> systemctl stop apache2 <span className="cmd-comment"># Sur SRV-WEB1 ou SRV-WEB2</span></div>
            </div>
            <div className="tip-box tip-green">
              <span className="tip-icon">✅</span>
              <div>Attendre <strong>30 secondes</strong>, puis vérifier dans la page des statistiques que le serveur arrêté passe en <span style={{color:"#f87171",fontWeight:"bold"}}>rouge (DOWN)</span>. HAProxy bascule automatiquement tout le trafic vers le serveur encore actif.</div>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: 5,
    label: "Script Firewall",
    color: "#8b5cf6",
    icon: "🛡️",
    steps: [
      {
        title: "Script IPTables complet",
        icon: "📜",
        content: (
          <div>
            <p className="intro-text">Script bash de configuration du pare-feu avec <strong>IPTables</strong> pour gérer le NAT, l'IP forwarding et les redirections SSH vers les serveurs web.</p>
            <div className="cmd-block">
              <div className="cmd-line"><span className="prompt">$</span> nano /etc/firewall.sh</div>
            </div>
            <div className="file-block">
              <div className="file-header">📄 /etc/firewall.sh</div>
              <pre>{`#!/bin/bash

start(){
    echo "- Application des règles IPTABLES !"

    # Suppression des anciennes règles
    iptables -F
    iptables -X
    iptables -t nat -F

    # Activation de l'IP_FORWARDING
    echo 1 > /proc/sys/net/ipv4/ip_forward
    iptables -t nat -A POSTROUTING -o ens36 -j MASQUERADE

    # NAT pour SSH sur les SRV-WEB
    iptables -t nat -A PREROUTING -p tcp -d 192.168.254.136 --dport 2221 -j DNAT --to-destination 172.20.0.11:22
    iptables -t nat -A PREROUTING -p tcp -d 192.168.254.136 --dport 2222 -j DNAT --to-destination 172.20.0.12:22

    echo "[ Terminé ! ]"
    echo
}

stop(){
    echo "- Flush des règles IPTABLES !"
    iptables -F
    iptables -X
    iptables -t nat -F
    echo "[ Terminé ! ]"
}

case $1 in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        stop
        start
        ;;
    status)
        /sbin/iptables -L
        /sbin/iptables -t nat -L
        ;;
    *)
        echo "Utilisation : firewall start | stop | restart | status"
esac
exit`}</pre>
            </div>
            <p className="section-subtitle">Rendre le script exécutable</p>
            <div className="cmd-block">
              <div className="cmd-line"><span className="prompt">$</span> chmod +x /etc/firewall.sh</div>
            </div>
          </div>
        ),
      },
      {
        title: "Utilisation du script firewall",
        icon: "🔧",
        content: (
          <div>
            <p className="intro-text">Le script accepte 4 commandes : <code>start</code>, <code>stop</code>, <code>restart</code>, <code>status</code>.</p>
            <div className="cmd-block">
              <div className="cmd-line"><span className="prompt">$</span> bash /etc/firewall.sh start   <span className="cmd-comment"># Appliquer les règles</span></div>
              <div className="cmd-line"><span className="prompt">$</span> bash /etc/firewall.sh stop    <span className="cmd-comment"># Vider toutes les règles</span></div>
              <div className="cmd-line"><span className="prompt">$</span> bash /etc/firewall.sh restart <span className="cmd-comment"># Recharger les règles</span></div>
              <div className="cmd-line"><span className="prompt">$</span> bash /etc/firewall.sh status  <span className="cmd-comment"># Afficher les règles actives</span></div>
            </div>
            <p className="section-subtitle">Explication des règles IPTables</p>
            <div className="directive-list">
              {[
                ["iptables -F", "Flush (supprime) toutes les règles de la chaîne filter."],
                ["iptables -X", "Supprime toutes les chaînes personnalisées."],
                ["iptables -t nat -F", "Vide les règles de la table NAT."],
                ["echo 1 > /proc/sys/net/ipv4/ip_forward", "Active le routage IP (IP forwarding) — permet à la machine de router les paquets entre interfaces."],
                ["iptables -t nat -A POSTROUTING -o ens36 -j MASQUERADE", "Active le masquage NAT sur l'interface WAN (ens36) → les machines LAN accèdent à Internet via l'IP publique de HAProxy."],
                ["PREROUTING -p tcp -d 192.168.254.136 --dport 2221 -j DNAT --to 172.20.0.11:22", "Redirige les connexions SSH arrivant sur le port 2221 vers SRV-WEB1 (port 22)."],
                ["PREROUTING -p tcp -d 192.168.254.136 --dport 2222 -j DNAT --to 172.20.0.12:22", "Redirige les connexions SSH arrivant sur le port 2222 vers SRV-WEB2 (port 22)."],
              ].map(([cmd, desc], i) => (
                <div className="directive-item" key={i}>
                  <code className="directive-cmd">{cmd}</code>
                  <p className="directive-desc">{desc}</p>
                </div>
              ))}
            </div>
            <div className="tip-box tip-blue">
              <span className="tip-icon">💡</span>
              <div>Grâce aux règles DNAT, on peut administrer SRV-WEB1 et SRV-WEB2 en SSH depuis l'extérieur via des ports différents sur l'IP de HAProxy :<br />
              <code>ssh user@192.168.254.136 -p 2221</code> → SRV-WEB1<br />
              <code>ssh user@192.168.254.136 -p 2222</code> → SRV-WEB2
              </div>
            </div>
          </div>
        ),
      },
    ],
  },
];

/* ─────────────────────────────────────────────
   COMPOSANT PRINCIPAL
───────────────────────────────────────────── */
function HaproxyTuto() {
  const [activeMod, setActiveMod] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const mod = modules[activeMod];
  const step = mod.steps[activeStep];
  const totalSteps = mod.steps.length;
  const color = mod.color;

  const goStep = (n) => {
    if (n < 0) {
      if (activeMod > 0) {
        setActiveMod(activeMod - 1);
        setActiveStep(modules[activeMod - 1].steps.length - 1);
      }
    } else if (n >= totalSteps) {
      if (activeMod < modules.length - 1) {
        setActiveMod(activeMod + 1);
        setActiveStep(0);
      }
    } else {
      setActiveStep(n);
    }
  };

  const isFirst = activeMod === 0 && activeStep === 0;
  const isLast = activeMod === modules.length - 1 && activeStep === totalSteps - 1;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Bricolage+Grotesque:wght@400;600;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .app { min-height: 100vh; background: #0a0c10; color: #e2e8f0; font-family: 'Bricolage Grotesque', sans-serif; display: flex; flex-direction: column; }

        /* ── HEADER ── */
        .header { background: #0f1318; border-bottom: 1px solid #1e2430; padding: 1.25rem 1.75rem; position: sticky; top: 0; z-index: 100; }
        .header-top { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem; }
        .logo { width: 46px; height: 46px; border-radius: 12px; background: linear-gradient(135deg, #06b6d4, #0891b2); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; box-shadow: 0 0 22px rgba(6,182,212,0.4); }
        .header-title { font-size: 1.45rem; font-weight: 800; color: #f1f5f9; letter-spacing: -.5px; }
        .header-sub { font-size: .75rem; color: #64748b; font-family: 'IBM Plex Mono', monospace; margin-top: .15rem; }

        /* ── MODULE TABS ── */
        .module-tabs { display: flex; gap: .5rem; flex-wrap: wrap; }
        .mod-btn { background: transparent; border: 1.5px solid #1e2430; color: #64748b; padding: .4rem 1rem; border-radius: 8px; cursor: pointer; font-family: 'Bricolage Grotesque', sans-serif; font-size: .82rem; font-weight: 600; display: flex; align-items: center; gap: .45rem; transition: all .2s; }
        .mod-btn:hover { border-color: var(--mc); color: var(--mc); background: color-mix(in srgb, var(--mc) 8%, transparent); }
        .mod-btn.active { background: var(--mc); border-color: var(--mc); color: #fff; box-shadow: 0 0 14px color-mix(in srgb, var(--mc) 50%, transparent); }
        .mod-badge { background: rgba(255,255,255,.22); border-radius: 5px; padding: .05rem .38rem; font-size: .68rem; font-family: 'IBM Plex Mono', monospace; }

        /* ── LAYOUT ── */
        .layout { display: flex; flex: 1; max-width: 1100px; width: 100%; margin: 0 auto; }

        .sidebar { width: 220px; flex-shrink: 0; border-right: 1px solid #1e2430; padding: 1.5rem 1rem; position: sticky; top: 100px; height: calc(100vh - 100px); overflow-y: auto; }
        .sidebar-title { font-size: .7rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: .8px; font-family: 'IBM Plex Mono', monospace; margin-bottom: .75rem; }
        .sidebar-item { display: flex; align-items: flex-start; gap: .55rem; padding: .55rem .65rem; border-radius: 8px; cursor: pointer; transition: all .18s; font-size: .82rem; color: #64748b; margin-bottom: .2rem; border: 1.5px solid transparent; }
        .sidebar-item:hover { background: #161b24; color: #cbd5e1; }
        .sidebar-item.active { background: color-mix(in srgb, var(--mc) 12%, transparent); border-color: color-mix(in srgb, var(--mc) 35%, transparent); color: var(--mc); font-weight: 600; }
        .sidebar-icon { font-size: 1rem; flex-shrink: 0; margin-top: .05rem; }
        .sidebar-num { font-family: 'IBM Plex Mono', monospace; font-size: .68rem; color: #334155; flex-shrink: 0; padding-top: .22rem; }

        .content { flex: 1; padding: 2rem 2.25rem; overflow-y: auto; }

        /* ── STEP HEADER ── */
        .step-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.75rem; padding-bottom: 1.5rem; border-bottom: 1px solid #1e2430; }
        .step-icon-big { font-size: 2rem; width: 54px; height: 54px; display: flex; align-items: center; justify-content: center; background: #161b24; border: 1.5px solid #1e2430; border-radius: 12px; }
        .step-title-big { font-size: 1.55rem; font-weight: 800; color: #f1f5f9; line-height: 1.2; }
        .step-sub { font-size: .78rem; color: #475569; font-family: 'IBM Plex Mono', monospace; margin-top: .25rem; }

        .progress-bar { height: 3px; background: #1e2430; border-radius: 2px; overflow: hidden; margin-bottom: 1.75rem; }
        .progress-fill { height: 100%; background: var(--mc); transition: width .4s ease; }

        /* ── NAV ── */
        .nav-actions { display: flex; justify-content: space-between; margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid #1e2430; }
        .nav-btn { background: #161b24; border: 1.5px solid #1e2430; color: #cbd5e1; padding: .55rem 1.35rem; border-radius: 8px; cursor: pointer; font-family: 'Bricolage Grotesque', sans-serif; font-size: .88rem; font-weight: 600; transition: all .2s; display: flex; align-items: center; gap: .45rem; }
        .nav-btn:hover { border-color: var(--mc); color: var(--mc); }
        .nav-btn:disabled { opacity: .3; cursor: not-allowed; pointer-events: none; }
        .nav-btn.primary { background: var(--mc); border-color: var(--mc); color: #fff; }
        .nav-btn.primary:hover { filter: brightness(1.1); }

        /* ── CONTENU ── */
        .intro-text { color: #94a3b8; line-height: 1.75; margin-bottom: 1.25rem; font-size: .93rem; }
        .section-subtitle { font-size: .78rem; font-weight: 700; color: var(--mc); text-transform: uppercase; letter-spacing: 1px; margin: 1.5rem 0 .7rem; font-family: 'IBM Plex Mono', monospace; }

        .info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: .65rem; margin-bottom: 1.25rem; }
        .info-card { background: #0f1318; border: 1.5px solid #1e2430; border-radius: 10px; padding: .8rem 1rem; display: flex; align-items: center; gap: .75rem; transition: border-color .2s; }
        .info-card:hover { border-color: var(--mc); }
        .info-icon { font-size: 1.3rem; }
        .info-label { font-size: .68rem; color: #475569; font-family: 'IBM Plex Mono', monospace; text-transform: uppercase; }
        .info-value { font-size: .85rem; color: #e2e8f0; margin-top: .12rem; }
        .info-value a { color: #60a5fa; text-decoration: none; }
        .info-value a:hover { text-decoration: underline; }

        .tip-box { display: flex; gap: .75rem; padding: .85rem 1rem; background: rgba(229,91,45,.06); border: 1.5px solid rgba(229,91,45,.2); border-left: 3px solid #e55b2d; border-radius: 0 8px 8px 0; margin: .9rem 0; font-size: .87rem; color: #94a3b8; line-height: 1.65; }
        .tip-box.tip-blue { background: rgba(96,165,250,.06); border-color: rgba(96,165,250,.2); border-left-color: #60a5fa; }
        .tip-box.tip-green { background: rgba(52,211,153,.06); border-color: rgba(52,211,153,.2); border-left-color: #34d399; }
        .tip-icon { font-size: 1rem; flex-shrink: 0; margin-top: .1rem; }

        .cmd-block { background: #070a0d; border: 1.5px solid #1e2430; border-radius: 10px; padding: .9rem 1.15rem; margin: .7rem 0; font-family: 'IBM Plex Mono', monospace; font-size: .8rem; }
        .cmd-line { display: flex; gap: .55rem; padding: .18rem 0; color: #e2e8f0; line-height: 1.5; flex-wrap: wrap; }
        .prompt { color: var(--mc); user-select: none; flex-shrink: 0; }
        .cmd-comment { color: #334155; }

        .file-block { background: #070a0d; border: 1.5px solid #1e2430; border-radius: 10px; overflow: hidden; margin: .7rem 0; }
        .file-header { background: #0f1318; border-bottom: 1px solid #1e2430; padding: .5rem 1rem; font-size: .75rem; color: #475569; font-family: 'IBM Plex Mono', monospace; }
        .file-block pre { padding: .9rem 1.15rem; font-family: 'IBM Plex Mono', monospace; font-size: .8rem; color: #7dd3fc; white-space: pre-wrap; word-break: break-word; line-height: 1.75; }

        .topo-table { border: 1.5px solid #1e2430; border-radius: 10px; overflow: hidden; margin-bottom: 1.25rem; }
        .topo-row { display: grid; grid-template-columns: repeat(4, 1fr); padding: .55rem 1.1rem; font-size: .85rem; border-bottom: 1px solid #161b24; }
        .topo-row.two { grid-template-columns: repeat(2, 1fr); }
        .topo-row:last-child { border-bottom: none; }
        .topo-row.header { background: #0f1318; font-size: .72rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: .5px; font-family: 'IBM Plex Mono', monospace; }
        .topo-row span:first-child { color: #94a3b8; }
        .topo-row span:not(:first-child) { color: #e2e8f0; }

        .steps-list { display: flex; flex-direction: column; gap: .5rem; margin: .75rem 0; }
        .step-item { display: flex; gap: .75rem; align-items: flex-start; background: #0f1318; border: 1.5px solid #1e2430; border-radius: 8px; padding: .7rem .9rem; transition: border-color .2s; }
        .step-item:hover { border-color: color-mix(in srgb, var(--mc) 40%, transparent); }
        .step-num-small { background: color-mix(in srgb, var(--mc) 20%, transparent); color: var(--mc); border-radius: 6px; width: 24px; height: 24px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: .72rem; font-weight: 700; font-family: 'IBM Plex Mono', monospace; margin-top: .1rem; }
        .step-item-text { font-size: .88rem; color: #cbd5e1; font-weight: 600; }
        .step-item-note { font-size: .78rem; color: #475569; margin-top: .15rem; }

        /* Algorithmes */
        .algo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: .75rem; }
        .algo-card { background: #0f1318; border: 1.5px solid #1e2430; border-radius: 10px; padding: 1rem 1.1rem; transition: border-color .2s; }
        .algo-card:hover { border-color: var(--mc); }
        .algo-header { display: flex; align-items: center; gap: .6rem; margin-bottom: .6rem; flex-wrap: wrap; }
        .algo-icon { font-size: 1.2rem; }
        .algo-name { font-weight: 700; color: #f1f5f9; font-size: .9rem; }
        .algo-badge { background: color-mix(in srgb, var(--mc) 20%, transparent); color: var(--mc); font-size: .68rem; font-weight: 700; padding: .15rem .5rem; border-radius: 4px; font-family: 'IBM Plex Mono', monospace; }
        .algo-badge.used { background: rgba(52,211,153,.15); color: #34d399; }
        .algo-desc { font-size: .83rem; color: #64748b; line-height: 1.6; }

        /* Directives */
        .directive-list { display: flex; flex-direction: column; gap: .6rem; }
        .directive-item { background: #0f1318; border: 1.5px solid #1e2430; border-radius: 8px; padding: .8rem 1rem; transition: border-color .2s; }
        .directive-item:hover { border-color: color-mix(in srgb, var(--mc) 40%, transparent); }
        .directive-cmd { display: block; font-family: 'IBM Plex Mono', monospace; font-size: .8rem; color: #7dd3fc; background: #070a0d; padding: .3rem .65rem; border-radius: 5px; margin-bottom: .5rem; word-break: break-all; }
        .directive-desc { font-size: .84rem; color: #64748b; line-height: 1.6; }

        /* Schéma */
        .schema-box { display: flex; align-items: center; gap: 1rem; background: #0f1318; border: 1.5px solid #1e2430; border-radius: 12px; padding: 1.25rem 1.5rem; margin: 1.25rem 0; flex-wrap: wrap; justify-content: center; }
        .schema-client, .schema-haproxy { background: #161b24; border: 1.5px solid #1e2430; border-radius: 10px; padding: .75rem 1rem; text-align: center; font-size: .85rem; font-weight: 700; color: #f1f5f9; min-width: 110px; }
        .schema-haproxy { border-color: var(--mc); color: var(--mc); box-shadow: 0 0 12px color-mix(in srgb, var(--mc) 30%, transparent); }
        .schema-sub { font-size: .7rem; color: #475569; font-family: 'IBM Plex Mono', monospace; margin-top: .25rem; font-weight: 400; }
        .schema-arrow { color: #475569; font-size: .85rem; font-family: 'IBM Plex Mono', monospace; }
        .schema-split { display: flex; flex-direction: column; gap: .5rem; }
        .schema-arrow-split { color: #475569; font-size: .78rem; font-family: 'IBM Plex Mono', monospace; }
        .schema-servers { display: flex; flex-direction: column; gap: .5rem; }
        .schema-srv { background: #161b24; border: 1.5px solid #1e2430; border-radius: 8px; padding: .5rem .85rem; text-align: center; font-size: .82rem; font-weight: 600; color: #cbd5e1; min-width: 120px; }
        .schema-srv .schema-sub { color: #475569; }

        code { font-family: 'IBM Plex Mono', monospace; background: #161b24; border: 1px solid #1e2430; padding: .1em .4em; border-radius: 4px; font-size: .82em; color: #7dd3fc; }
        strong { color: #f1f5f9; }
        em { color: #a5b4fc; font-style: normal; }

        @media (max-width: 768px) {
          .sidebar { display: none; }
          .content { padding: 1.25rem 1rem; }
          .header { padding: 1rem; }
          .topo-row { grid-template-columns: 1fr 1fr !important; font-size: .75rem; }
        }
      `}</style>

      <div className="app" style={{ "--mc": color }}>
        {/* HEADER */}
        <header className="header">
          <div className="header-top">
            <div className="logo">⚖️</div>
            <div>
              <div className="header-title">HAProxy — Load Balancing</div>
              <div className="header-sub">High Availability · Round Robin · 172.20.0.0/24</div>
            </div>
          </div>
          <nav className="module-tabs">
            {modules.map((m, i) => (
              <button
                key={m.id}
                className={`mod-btn ${activeMod === i ? "active" : ""}`}
                style={{ "--mc": m.color }}
                onClick={() => { setActiveMod(i); setActiveStep(0); }}
              >
                {m.icon} {m.label}
                <span className="mod-badge">{m.steps.length}</span>
              </button>
            ))}
          </nav>
        </header>

        {/* LAYOUT */}
        <div className="layout">
          {/* SIDEBAR */}
          <aside className="sidebar" style={{ "--mc": color }}>
            <div className="sidebar-title">Étapes — {mod.label}</div>
            {mod.steps.map((s, i) => (
              <div
                key={i}
                className={`sidebar-item ${activeStep === i ? "active" : ""}`}
                onClick={() => setActiveStep(i)}
              >
                <span className="sidebar-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="sidebar-icon">{s.icon}</span>
                <span style={{ fontSize: ".8rem", lineHeight: 1.3 }}>{s.title}</span>
              </div>
            ))}
          </aside>

          {/* CONTENT */}
          <main className="content" style={{ "--mc": color }}>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${((activeStep + 1) / totalSteps) * 100}%` }} />
            </div>

            <div className="step-header">
              <div className="step-icon-big">{step.icon}</div>
              <div>
                <div className="step-title-big">{step.title}</div>
                <div className="step-sub">Module {mod.id} · Étape {activeStep + 1}/{totalSteps}</div>
              </div>
            </div>

            {step.content}

            <div className="nav-actions">
              <button className="nav-btn" onClick={() => goStep(activeStep - 1)} disabled={isFirst}>
                ← Précédent
              </button>
              <button className={`nav-btn ${!isLast ? "primary" : ""}`} onClick={() => goStep(activeStep + 1)} disabled={isLast}>
                Suivant →
              </button>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
