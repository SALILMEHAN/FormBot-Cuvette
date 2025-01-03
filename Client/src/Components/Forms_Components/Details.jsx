import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import styles from "../Forms_Components/Details.module.css";
import { API_URL } from "../../constants";

function Details({ Mode, formid }) {
  const [responses, setResponses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const BASE_URL = `${API_URL}`;
  const [stats, setStats] = useState({
    views: 0,
    starts: 0,
    completed: 0,
    completionRate: 0,
  });

  const theme = {
    backgroundColor: Mode === "dark" ? "rgba(24, 24, 27, 1)" : "white",
    color: Mode === "dark" ? "white" : "black",
    cardBackground: Mode === "dark" ? "rgba(55, 55, 62, 1)" : "white",
    border: Mode === "dark" ? "2px solid #383636" : "2px solid #d4c5c5",
    tableBackground: Mode === "dark" ? "#1a1a1a" : "white",
  };

  const textstyle = {
    color: theme.color,
  };

  const containerStyle = {
    backgroundColor: theme.backgroundColor,
    color: theme.color,
  };

  const cardStyle = {
    backgroundColor: theme.cardBackground,
    border: theme.border,
    color: theme.color,
  };

  const tableCellStyle = {
    backgroundColor: theme.tableBackground,
    border: theme.border,
    color: theme.color,
  };

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await fetch(`${BASE_URL}/Formbot/responses/${formid}`);
        const data = await response.json();

        if (data.responses) {
          const firstDoc = data.responses[0] || { viewCount: 0, startCount: 0 };
          const validResponses = data.responses.filter(
            (response) => response.answers && response.answers.length > 0
          );
          setResponses(validResponses);

          const uniqueQuestions = Array.from(
            new Set(
              validResponses.flatMap((response) =>
                response.answers.map((ans) => ans.question)
              )
            )
          );
          setQuestions(uniqueQuestions);

          setStats({
            views: firstDoc.viewCount || 0,
            starts: firstDoc.startCount || 0,
            completed: validResponses.length,
            completionRate: firstDoc.startCount
              ? Math.round((validResponses.length / firstDoc.startCount) * 100)
              : 0,
          });
        }
      } catch (error) {
        console.error("Error fetching responses:", error);
      }
    };

    fetchResponses();
  }, [formid]);

  const pieData = [
    { name: "Completed", value: stats.completed, color: "#6B7280" },
    {
      name: "Remaining",
      value: Math.max(100 - stats.completed, 0),
      color: "#3B82F6",
    },
  ];

  return (
    <div className={styles.container} style={containerStyle}>
      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statsCard}>
          <div className={styles.statsLabel1} style={cardStyle}>
            Views
            <div className={styles.statsValue} style={textstyle}>
              {stats.views}
            </div>
          </div>
        </div>
        <div className={styles.statsCard}>
          <div className={styles.statsLabel2} style={cardStyle}>
            Starts
            <div className={styles.statsValue} style={textstyle}>
              {stats.starts}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        {responses.length === 0 ? (
          <div className={styles.noResponseMessage}>No responses yet</div>
        ) : (
          <table className={styles.table} style={cardStyle}>
            <thead>
              <tr>
                <th style={tableCellStyle}>Submitted at</th>
                {questions.map((question, index) => (
                  <th key={index} style={tableCellStyle}>
                    {question.includes("http") || question.length > 10 ? (
                      <a target="_blank" href={question}>
                        Image
                      </a>
                    ) : (
                      question
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {responses.map((response, index) => (
                <tr key={index}>
                  <td style={tableCellStyle}>
                    {new Date(response.createdAt).toLocaleString()}
                  </td>
                  {questions.map((question, qIndex) => {
                    const answer = response.answers.find(
                      (a) => a.question === question
                    );
                    return (
                      <td key={qIndex} style={tableCellStyle}>
                        {answer?.answer || "-"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Charts Section */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <div className={styles.pieChartContainer}>
            <PieChart width={200} height={200}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={90}
                dataKey="value"
                startAngle={90}
                endAngle={450}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
            <div className={styles.pieChartCenter}>
              <div
                className={styles.pieChartLabel}
                style={{ color: theme.color }}
              >
                Completed
              </div>
              <div
                className={styles.pieChartValue}
                style={{ color: theme.color }}
              >
                {stats.completed}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.statsCard}>
          <div className={styles.statsLabe3} style={cardStyle}>
            Completion rate
            <div className={styles.statsValue} style={textstyle}>
              {stats.completionRate}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;
