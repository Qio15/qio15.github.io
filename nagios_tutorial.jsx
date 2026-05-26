const { useState } = React;

const steps = [
  {
    id: 1,
    title: "Introduction",
    icon: "🛡️",
    content: (
      <div>
        <p className="intro-text">
          <strong>Nagios</strong> est une application de surveillance système et réseau. Elle surveille les hôtes et services spécifiés, alertant lorsque les systèmes dysfonctionnent et quand ils repassent en fonctionnement normal. C'est un logiciel libre sous licence <span className="badge">GPL</span>.
        </p>
        <div className="info-grid">
          <div className="info-card">
            <span className="info-icon">🌐</span>
            <div>
              <div className="info-label">Interface Web</div>
              <div className="info-value">Vue d'ensemble du SI et des anomalies</div>
            </div>
          </div>
          <div className="info-card">
            <span className="info-icon">🔌</span>
            <div>
              <div className="info-label">Plugins / Greffons</div>
              <div className="info-value">~100 mini-programmes extensibles</div>
            </div>
          </div>
          <div className="info-card">
            <span className="info-icon">🔗</span>
            <div>
              <div className="info-label">Site Officiel</div>
              <div className="info-value"><a href="https://www.nagios.org/" target="_blank" rel="noreferrer">nagios.org</a></div>
            </div>
          </div>
        </div>
        <div className="tip-box">
          <span className="tip-icon">💡</span>
          <div><strong>LTS</strong> (Long Term Support) : version d'un logiciel dont le support est assuré pour une durée plus longue que la normale.</div>
        </div>
        <div className="tip-box tip-blue">
          <span className="tip-icon">⌨️</span>
          <div><strong>Clavier FR :</strong> <code>dpkg-reconfigure keyboard-configuration</code> puis appuyez 4 fois sur Entrée.</div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: "Topologie",
    icon: "🗺️",
    content: (
      <div>
        <p className="intro-text">Machine Ubuntu 20.04 LTS avec <strong>deux interfaces réseau</strong>.</p>
        <div className="topo-table">
          <div className="topo-row header">
            <span>Paramètre</span><span>Valeur</span>
          </div>
          <div className="topo-row"><span>Hostname</span><span><code>nagios</code></span></div>
          <div className="topo-row"><span>Carte 1</span><span>Bridged ou NAT (DHCP)</span></div>
          <div className="topo-row"><span>Carte 2</span><span><code>172.20.0.31/24</code> (static)</span></div>
          <div className="topo-row"><span>Segment LAN</span><span><code>stadiumcompany.com</code></span></div>
        </div>
        <p className="section-subtitle">Configuration des interfaces :</p>
        <div className="cmd-block">
          <div className="cmd-line"><span className="prompt">$</span> sudo su</div>
          <div className="cmd-line"><span className="prompt">$</span> apt install ifupdown -y</div>
          <div className="cmd-line"><span className="prompt">$</span> ip a</div>
          <div className="cmd-line"><span className="prompt">$</span> nano /etc/network/interfaces</div>
        </div>
        <div className="file-block">
          <div className="file-header">📄 /etc/network/interfaces</div>
          <pre>{`auto lo
iface lo inet loopback

auto ens33
iface ens33 inet dhcp

auto ens38
iface ens38 inet static
  address 172.20.0.31/24`}</pre>
        </div>
        <div className="cmd-block">
          <div className="cmd-line"><span className="prompt">$</span> service networking restart</div>
          <div className="cmd-line"><span className="prompt">$</span> nano /etc/hostname  <span className="cmd-comment"># → nagios</span></div>
          <div className="cmd-line"><span className="prompt">$</span> nano /etc/hosts</div>
        </div>
        <div className="file-block">
          <div className="file-header">📄 /etc/hosts</div>
          <pre>{`127.0.0.1   nagios.m2l.local   nagios   localhost
172.20.0.31 nagios.m2l.local   nagios`}</pre>
        </div>
        <div className="tip-box tip-green">
          <span className="tip-icon">✅</span>
          <div><strong>Validation :</strong> <code>ping 1.1.1.1</code> (passerelle) et <code>ping google.fr</code> (DNS)</div>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: "Installation Nagios",
    icon: "⚙️",
    content: (
      <div>
        <p className="section-subtitle">1. Prérequis</p>
        <div className="cmd-block">
          <div className="cmd-line"><span className="prompt">$</span> apt update && apt upgrade -y</div>
          <div className="cmd-line"><span className="prompt">$</span> apt install -y autoconf gcc libc6 make wget unzip apache2 php libapache2-mod-php libgd-dev libssl-dev</div>
        </div>
        <p className="section-subtitle">2. Téléchargement & Compilation</p>
        <div className="cmd-block">
          <div className="cmd-line"><span className="prompt">$</span> cd /tmp</div>
          <div className="cmd-line"><span className="prompt">$</span> wget -O nagioscore.tar.gz https://github.com/NagiosEnterprises/nagioscore/archive/nagios-4.4.8.tar.gz</div>
          <div className="cmd-line"><span className="prompt">$</span> tar xvzf nagioscore.tar.gz</div>
          <div className="cmd-line"><span className="prompt">$</span> cd nagioscore-nagios-4.4.8/</div>
          <div className="cmd-line"><span className="prompt">$</span> ./configure --with-httpd-conf=/etc/apache2/sites-enabled</div>
          <div className="cmd-line"><span className="prompt">$</span> make all</div>
        </div>
        <p className="section-subtitle">3. Utilisateur & Groupe</p>
        <div className="cmd-block">
          <div className="cmd-line"><span className="prompt">$</span> make install-groups-users</div>
          <div className="cmd-line"><span className="prompt">$</span> usermod -a -G nagios www-data</div>
        </div>
        <p className="section-subtitle">4. Installation des binaires & services</p>
        <div className="cmd-block">
          <div className="cmd-line"><span className="prompt">$</span> make install</div>
          <div className="cmd-line"><span className="prompt">$</span> make install-daemoninit</div>
          <div className="cmd-line"><span className="prompt">$</span> make install-commandmode</div>
          <div className="cmd-line"><span className="prompt">$</span> make install-config</div>
          <div className="cmd-line"><span className="prompt">$</span> make install-webconf</div>
          <div className="cmd-line"><span className="prompt">$</span> a2enmod rewrite && systemctl restart apache2</div>
          <div className="cmd-line"><span className="prompt">$</span> a2enmod cgi && systemctl restart apache2</div>
        </div>
        <p className="section-subtitle">5. Pare-feu & Compte Admin</p>
        <div className="cmd-block">
          <div className="cmd-line"><span className="prompt">$</span> ufw allow Apache && ufw reload</div>
          <div className="cmd-line"><span className="prompt">$</span> htpasswd -c /usr/local/nagios/etc/htpasswd.users nagiosadmin</div>
          <div className="cmd-line"><span className="prompt">$</span> systemctl restart apache2</div>
          <div className="cmd-line"><span className="prompt">$</span> systemctl start nagios.service</div>
          <div className="cmd-line"><span className="prompt">$</span> systemctl status nagios.service</div>
        </div>
        <div className="tip-box tip-green">
          <span className="tip-icon">🎉</span>
          <div>Accéder à Nagios : <code>http://172.20.0.31/nagios</code> ou <code>http://nagios.m2l.local/nagios</code></div>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: "Plugins Nagios",
    icon: "🔌",
    content: (
      <div>
        <p className="intro-text">Installation des <strong>Nagios Plugins 2.2.1</strong> nécessaires au bon fonctionnement de Nagios Core.</p>
        <p className="section-subtitle">Prérequis</p>
        <div className="cmd-block">
          <div className="cmd-line"><span className="prompt">$</span> apt install -y libmcrypt-dev libssl-dev bc gawk dc build-essential snmp libnet-snmp-perl gettext</div>
        </div>
        <p className="section-subtitle">Téléchargement</p>
        <div className="cmd-block">
          <div className="cmd-line"><span className="prompt">$</span> cd /tmp</div>
          <div className="cmd-line"><span className="prompt">$</span> wget --no-check-certificate -O nagios-plugins.tar.gz https://github.com/nagios-plugins/nagios-plugins/archive/release-2.2.1.tar.gz</div>
          <div className="cmd-line"><span className="prompt">$</span> tar zxvf nagios-plugins.tar.gz</div>
        </div>
        <p className="section-subtitle">Compilation & Installation</p>
        <div className="cmd-block">
          <div className="cmd-line"><span className="prompt">$</span> cd nagios-plugins-release-2.2.1/</div>
          <div className="cmd-line"><span className="prompt">$</span> ./tools/setup</div>
          <div className="cmd-line"><span className="prompt">$</span> ./configure</div>
          <div className="cmd-line"><span className="prompt">$</span> make</div>
          <div className="cmd-line"><span className="prompt">$</span> make install</div>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    title: "Supervision Windows",
    icon: "🪟",
    content: (
      <div>
        <p className="section-subtitle">1. Activer windows.cfg</p>
        <div className="cmd-block">
          <div className="cmd-line"><span className="prompt">$</span> nano -c /usr/local/nagios/etc/nagios.cfg</div>
        </div>
        <div className="tip-box">
          <span className="tip-icon">📝</span>
          <div>Décommenter la <strong>ligne 38</strong> : <code>cfg_file=.../objects/windows.cfg</code><br/>
          Idem <strong>ligne 41</strong> pour switch.cfg et <strong>ligne 44</strong> pour printer.cfg.</div>
        </div>
        <p className="section-subtitle">2. Éditer windows.cfg</p>
        <div className="cmd-block">
          <div className="cmd-line"><span className="prompt">$</span> nano -c /usr/local/nagios/etc/objects/windows.cfg</div>
        </div>
        <div className="file-block">
          <div className="file-header">📄 Bloc DC (ligne 24)</div>
          <pre>{`define host{
    use          windows-server
    host_name    DC
    alias        AD-DS
    address      172.20.0.10
}`}</pre>
        </div>
        <div className="file-block">
          <div className="file-header">📄 Bloc SDC</div>
          <pre>{`define host{
    use          windows-server
    host_name    SDC
    alias        My secondary Windows Server
    address      172.20.0.11
}`}</pre>
        </div>
        <div className="tip-box tip-blue">
          <span className="tip-icon">ℹ️</span>
          <div>Dans les blocs <code>define service</code> plus bas, remplacer <code>winserver</code> par <code>DC, SDC</code>.<br/>
          Plusieurs serveurs se séparent par une virgule.</div>
        </div>
        <div className="cmd-block">
          <div className="cmd-line"><span className="prompt">$</span> service nagios restart</div>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    title: "Supervision Linux",
    icon: "🐧",
    content: (
      <div>
        <p className="section-subtitle">Éditer localhost.cfg</p>
        <div className="cmd-block">
          <div className="cmd-line"><span className="prompt">$</span> nano -c /usr/local/nagios/etc/objects/localhost.cfg</div>
        </div>
        <div className="file-block">
          <div className="file-header">📄 Bloc Nagios (serveur de supervision)</div>
          <pre>{`define host{
    use          linux-server
    host_name    Nagios
    alias        Serveur de supervision
    address      172.20.0.31
}`}</pre>
        </div>
        <div className="file-block">
          <div className="file-header">📄 Bloc Zimbra (messagerie)</div>
          <pre>{`define host{
    use          linux-server
    host_name    Zimbra
    alias        Serveur de messagerie
    address      172.20.0.15
}`}</pre>
        </div>
        <div className="tip-box">
          <span className="tip-icon">📝</span>
          <div>Dans le bloc <code>define hostgroup</code>, changer <code>members</code> : remplacer <code>localhost</code> par <code>Nagios,Zimbra</code>.</div>
        </div>
        <div className="file-block">
          <div className="file-header">📄 Exemple define service PING</div>
          <pre>{`define service{
    use                  local-service
    host_name            Nagios, Zimbra
    service_description  PING
    check_command        check_ping!100.0,20%!500.0,60%
}`}</pre>
        </div>
      </div>
    ),
  },
  {
    id: 7,
    title: "Notifications Mail",
    icon: "📧",
    content: (
      <div>
        <p className="section-subtitle">1. Installation des paquets</p>
        <div className="cmd-block">
          <div className="cmd-line"><span className="prompt">$</span> apt install sendmail mailutils ssmtp</div>
        </div>
        <p className="section-subtitle">2. Configuration SSMTP</p>
        <div className="cmd-block">
          <div className="cmd-line"><span className="prompt">$</span> nano -c /etc/ssmtp/ssmtp.conf</div>
        </div>
        <div className="file-block">
          <div className="file-header">📄 Ligne 10 à modifier</div>
          <pre>{`mailhub=mail.stadiumcompany.com`}</pre>
        </div>
        <div className="cmd-block">
          <div className="cmd-line"><span className="prompt">$</span> nano -c /etc/ssmtp/revaliases</div>
        </div>
        <div className="file-block">
          <div className="file-header">📄 Ajouter</div>
          <pre>{`root:adminNagios@stadiumcompany.com`}</pre>
        </div>
        <p className="section-subtitle">3. DNS</p>
        <div className="cmd-block">
          <div className="cmd-line"><span className="prompt">$</span> nano /etc/resolv.conf</div>
        </div>
        <div className="file-block">
          <div className="file-header">📄 /etc/resolv.conf</div>
          <pre>{`nameserver 172.20.0.10
nameserver 1.1.1.1
search stadiumcompany.com`}</pre>
        </div>
        <div className="cmd-block">
          <div className="cmd-line"><span className="prompt">$</span> nslookup mail.stadiumcompany.com</div>
          <div className="cmd-line"><span className="prompt">$</span> service nagios restart</div>
          <div className="cmd-line"><span className="prompt">$</span> echo "Contenu du mail" | mail -s "Sujet 1" admin@stadiumcompany.com</div>
        </div>
        <p className="section-subtitle">4. contacts.cfg</p>
        <div className="cmd-block">
          <div className="cmd-line"><span className="prompt">$</span> nano /usr/local/nagios/etc/objects/contacts.cfg</div>
        </div>
        <div className="file-block">
          <div className="file-header">📄 contacts.cfg</div>
          <pre>{`define contact{
    contact_name                  nagiosadmin
    alias                         Admin Alerte Nagios
    email                         admin@stadiumcompany.com
    service_notification_period   24x7
    service_notification_options  w,u,c,r,f,s
    service_notification_commands notify-service-by-email
    host_notification_period      24x7
    host_notification_options     d,u,r,f,s
    host_notification_commands    notify-host-by-email
}`}</pre>
        </div>
        <div className="info-grid">
          <div className="info-card small"><span className="badge">w</span><span>WARNING</span></div>
          <div className="info-card small"><span className="badge">u</span><span>UNKNOWN</span></div>
          <div className="info-card small"><span className="badge">c</span><span>CRITICAL</span></div>
          <div className="info-card small"><span className="badge">r</span><span>RECOVERY</span></div>
          <div className="info-card small"><span className="badge">d</span><span>DOWN</span></div>
          <div className="info-card small"><span className="badge">f</span><span>FLAPPING</span></div>
        </div>
      </div>
    ),
  },
  {
    id: 8,
    title: "Autoriser Notifications",
    icon: "🔔",
    content: (
      <div>
        <p className="section-subtitle">Droits & Configuration</p>
        <div className="cmd-block">
          <div className="cmd-line"><span className="prompt">$</span> chown -R nagios:www-data /usr/local/nagios/var/rw</div>
        </div>
        <div className="tip-box">
          <span className="tip-icon">📝</span>
          <div>Dans chaque bloc <code>define host&#123;&#125;</code> et <code>define service&#123;&#125;</code> des fichiers <code>windows.cfg</code>, <code>localhost.cfg</code> et <code>switch.cfg</code>, ajouter :</div>
        </div>
        <div className="file-block">
          <div className="file-header">📄 À ajouter dans chaque bloc</div>
          <pre>{`contact_groups    admins
contacts          nagiosadmin`}</pre>
        </div>
        <div className="tip-box">
          <span className="tip-icon">📝</span>
          <div>Faire de même dans <code>/usr/local/nagios/etc/objects/templates.cfg</code> pour chaque <code>define host&#123;&#125;</code> et <code>define service&#123;&#125;</code>.</div>
        </div>
        <p className="section-subtitle">commands.cfg — Lignes 29 & 37</p>
        <div className="cmd-block">
          <div className="cmd-line"><span className="prompt">$</span> nano -c /usr/local/nagios/etc/objects/commands.cfg</div>
        </div>
        <div className="file-block">
          <div className="file-header">📄 Vérifier que /usr/bin/mail est présent (compléter par /usr)</div>
          <pre>{`define command{
    command_name  notify-host-by-email
    command_line  /usr/bin/printf "%b" "..." | /usr/bin/mail -s "..." $CONTACTEMAIL$
}

define command{
    command_name  notify-service-by-email
    command_line  /usr/bin/printf "%b" "..." | /usr/bin/mail -s "..." $CONTACTEMAIL$
}`}</pre>
        </div>
        <div className="cmd-block">
          <div className="cmd-line"><span className="prompt">$</span> service nagios restart</div>
        </div>
        <div className="tip-box tip-green">
          <span className="tip-icon">✅</span>
          <div>Vérifiez la réception des notifications dans la boîte <code>admin@stadiumcompany.com</code>.</div>
        </div>
      </div>
    ),
  },
];

function NagiosTuto() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Syne:wght@400;600;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .app {
          min-height: 100vh;
          background: #0d1117;
          color: #e6edf3;
          font-family: 'Syne', sans-serif;
          display: flex;
          flex-direction: column;
        }

        .header {
          background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
          border-bottom: 1px solid #21262d;
          padding: 2rem 2.5rem 1.5rem;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-top {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .logo {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #e6523a, #c0392b);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          box-shadow: 0 0 20px rgba(230,82,58,0.4);
        }

        .header-title { font-size: 1.5rem; font-weight: 800; color: #f0f6fc; letter-spacing: -0.5px; }
        .header-sub { font-size: 0.8rem; color: #8b949e; font-family: 'JetBrains Mono', monospace; }

        .steps-nav {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .step-btn {
          background: transparent;
          border: 1px solid #21262d;
          color: #8b949e;
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .step-btn:hover {
          border-color: #e6523a;
          color: #e6523a;
          background: rgba(230,82,58,0.08);
        }

        .step-btn.active {
          background: #e6523a;
          border-color: #e6523a;
          color: #fff;
          box-shadow: 0 0 12px rgba(230,82,58,0.4);
        }

        .step-num {
          background: rgba(255,255,255,0.2);
          border-radius: 4px;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-family: 'JetBrains Mono', monospace;
        }

        .step-btn.active .step-num { background: rgba(255,255,255,0.25); }

        .main {
          flex: 1;
          max-width: 900px;
          width: 100%;
          margin: 0 auto;
          padding: 2.5rem 2rem;
        }

        .step-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #21262d;
        }

        .step-icon-big {
          font-size: 2.5rem;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 14px;
        }

        .step-title-big { font-size: 1.8rem; font-weight: 800; color: #f0f6fc; }
        .step-count { font-size: 0.8rem; color: #8b949e; font-family: 'JetBrains Mono', monospace; margin-top: 0.2rem; }

        .intro-text {
          color: #adb5bd;
          line-height: 1.7;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
        }

        .section-subtitle {
          font-size: 0.85rem;
          font-weight: 700;
          color: #e6523a;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 1.5rem 0 0.75rem;
          font-family: 'JetBrains Mono', monospace;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .info-card {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 10px;
          padding: 0.85rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: border-color 0.2s;
        }

        .info-card:hover { border-color: #e6523a; }
        .info-card.small { flex-direction: row; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; font-size: 0.82rem; color: #adb5bd; }

        .info-icon { font-size: 1.4rem; }
        .info-label { font-size: 0.72rem; color: #8b949e; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; }
        .info-value { font-size: 0.88rem; color: #e6edf3; margin-top: 0.15rem; }
        .info-value a { color: #58a6ff; text-decoration: none; }
        .info-value a:hover { text-decoration: underline; }

        .tip-box {
          display: flex;
          gap: 0.75rem;
          padding: 0.9rem 1.1rem;
          background: rgba(230,82,58,0.07);
          border: 1px solid rgba(230,82,58,0.25);
          border-left: 3px solid #e6523a;
          border-radius: 0 8px 8px 0;
          margin: 1rem 0;
          font-size: 0.88rem;
          color: #adb5bd;
          line-height: 1.6;
        }

        .tip-box.tip-blue {
          background: rgba(88,166,255,0.07);
          border-color: rgba(88,166,255,0.25);
          border-left-color: #58a6ff;
        }

        .tip-box.tip-green {
          background: rgba(63,185,80,0.07);
          border-color: rgba(63,185,80,0.25);
          border-left-color: #3fb950;
        }

        .tip-icon { font-size: 1.1rem; flex-shrink: 0; margin-top: 0.1rem; }

        .cmd-block {
          background: #0d1117;
          border: 1px solid #30363d;
          border-radius: 10px;
          padding: 1rem 1.25rem;
          margin: 0.75rem 0;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.82rem;
        }

        .cmd-line {
          display: flex;
          gap: 0.6rem;
          padding: 0.2rem 0;
          color: #e6edf3;
          line-height: 1.5;
          flex-wrap: wrap;
        }

        .prompt { color: #e6523a; user-select: none; flex-shrink: 0; }
        .cmd-comment { color: #6e7681; }

        .file-block {
          background: #0d1117;
          border: 1px solid #30363d;
          border-radius: 10px;
          overflow: hidden;
          margin: 0.75rem 0;
        }

        .file-header {
          background: #161b22;
          border-bottom: 1px solid #30363d;
          padding: 0.55rem 1rem;
          font-size: 0.78rem;
          color: #8b949e;
          font-family: 'JetBrains Mono', monospace;
        }

        .file-block pre {
          padding: 1rem 1.25rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.82rem;
          color: #a5d6ff;
          white-space: pre-wrap;
          word-break: break-word;
          line-height: 1.7;
        }

        .topo-table { border: 1px solid #30363d; border-radius: 10px; overflow: hidden; margin-bottom: 1.5rem; }
        .topo-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding: 0.6rem 1.1rem;
          font-size: 0.88rem;
          border-bottom: 1px solid #21262d;
        }
        .topo-row:last-child { border-bottom: none; }
        .topo-row.header { background: #161b22; font-size: 0.75rem; font-weight: 700; color: #8b949e; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'JetBrains Mono', monospace; }
        .topo-row span:first-child { color: #8b949e; }
        .topo-row span:last-child { color: #e6edf3; }

        code {
          font-family: 'JetBrains Mono', monospace;
          background: #161b22;
          border: 1px solid #30363d;
          padding: 0.1em 0.4em;
          border-radius: 4px;
          font-size: 0.85em;
          color: #a5d6ff;
        }

        .badge {
          display: inline-block;
          background: #e6523a;
          color: #fff;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.15em 0.5em;
          border-radius: 4px;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.5px;
        }

        .nav-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 2.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #21262d;
        }

        .nav-btn {
          background: #161b22;
          border: 1px solid #30363d;
          color: #e6edf3;
          padding: 0.6rem 1.4rem;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .nav-btn:hover { border-color: #e6523a; color: #e6523a; background: rgba(230,82,58,0.06); }
        .nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .nav-btn.primary { background: #e6523a; border-color: #e6523a; color: #fff; }
        .nav-btn.primary:hover { background: #c0392b; border-color: #c0392b; color: #fff; }

        .progress-bar {
          height: 3px;
          background: #21262d;
          width: 100%;
          margin-bottom: 1rem;
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #e6523a, #ff7043);
          transition: width 0.4s ease;
          border-radius: 2px;
        }

        strong { color: #f0f6fc; }

        @media (max-width: 640px) {
          .header { padding: 1.25rem 1rem 1rem; }
          .main { padding: 1.5rem 1rem; }
          .steps-nav { gap: 0.3rem; }
          .step-btn { font-size: 0.7rem; padding: 0.3rem 0.55rem; }
        }
      `}</style>

      <div className="app">
        <header className="header">
          <div className="header-top">
            <div className="logo">🛡️</div>
            <div>
              <div className="header-title">Nagios Core — Tuto</div>
              <div className="header-sub">Ubuntu 20.04 LTS • Production 6</div>
            </div>
          </div>
          <nav className="steps-nav">
            {steps.map((s, i) => (
              <button
                key={s.id}
                className={`step-btn ${activeStep === i ? "active" : ""}`}
                onClick={() => setActiveStep(i)}
              >
                <span className="step-num">{s.id}</span>
                {s.icon} {s.title}
              </button>
            ))}
          </nav>
        </header>

        <main className="main">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }} />
          </div>

          <div className="step-header">
            <div className="step-icon-big">{steps[activeStep].icon}</div>
            <div>
              <div className="step-title-big">{steps[activeStep].title}</div>
              <div className="step-count">Étape {activeStep + 1} / {steps.length}</div>
            </div>
          </div>

          {steps[activeStep].content}

          <div className="nav-actions">
            <button
              className="nav-btn"
              onClick={() => setActiveStep((p) => p - 1)}
              disabled={activeStep === 0}
            >
              ← Précédent
            </button>
            <button
              className={`nav-btn ${activeStep < steps.length - 1 ? "primary" : ""}`}
              onClick={() => setActiveStep((p) => Math.min(p + 1, steps.length - 1))}
              disabled={activeStep === steps.length - 1}
            >
              Suivant →
            </button>
          </div>
        </main>
      </div>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<NagiosTuto />);
